import {
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  GetObjectCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PRESIGNED_URL_EXPIRE, UPLOAD_CHUNK_SIZE } from './constants';
import { ConfigService } from '@nestjs/config';
import {
  CompleteUploadDto,
  CreateFileData,
  GetPresignedUrlDto,
  InitFileUploadData,
  InitFileUploadResponse,
} from './dto';
import { v4 as uuidv4 } from 'uuid';
import { MediaRepository } from './repositories';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { FileStatus } from 'generated/prisma/enums';
import { File } from 'generated/prisma/client';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class MediaService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly CHUNK_SIZE = UPLOAD_CHUNK_SIZE; // 10 MB

  private readonly logger = new Logger(MediaService.name);

  constructor(
    private configService: ConfigService,
    private readonly mediaRepository: MediaRepository,
    private readonly redis: RedisService,
  ) {
    this.s3Client = new S3Client({
      endpoint: this.configService.getOrThrow<string>('AWS_ENDPOINT'),
      region: this.configService.getOrThrow<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
    this.bucketName = this.configService.getOrThrow<string>('AWS_BUCKET_NAME');
  }

  public async initFileUpload(
    data: InitFileUploadData,
    userId: string,
  ): Promise<InitFileUploadResponse> {
    const fileId = uuidv4();
    const fileKey = this.generateFileKey(data.filename, fileId);

    this.logger.log(`File key: ${fileKey}`);

    const command = new CreateMultipartUploadCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      ContentType: data.contentType,
    });

    const response = await this.s3Client.send(command);

    if (!response.UploadId) {
      this.logger.error('uploadId отсутствует');
      throw new InternalServerErrorException('uploadId is missing');
    }

    this.logger.debug(response);

    const fileData: CreateFileData = {
      id: fileId,
      key: fileKey,
      mimeType: data.contentType,
    };

    await this.mediaRepository.create(fileData, userId);

    return {
      uploadId: response.UploadId,
      fileKey: fileKey,
      chunkSize: this.CHUNK_SIZE,
    };
  }

  public async getPartPresignedUrl(
    dto: GetPresignedUrlDto,
    userId: string,
  ): Promise<string> {
    const file = await this.fetchAndValidateFileOwner(dto.key, userId);

    if (
      file.status == FileStatus.COMPLETED ||
      file.status == FileStatus.FAILED
    ) {
      this.logger.error('Не удалось загрузить часть');
      throw new BadRequestException('Failed to upload part');
    }

    const command = new UploadPartCommand({
      Bucket: this.bucketName,
      Key: dto.key,
      UploadId: dto.uploadId,
      PartNumber: dto.partNumber,
    });

    return await getSignedUrl(this.s3Client, command, {
      expiresIn: PRESIGNED_URL_EXPIRE,
    });
  }

  public async getFileUrl(fileId: string): Promise<string> {
    const cacheKey = `file:url:${fileId}`;

    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const file = await this.mediaRepository.findById(fileId);
    if (!file) throw new NotFoundException('File not found');

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: file.key,
    });

    const url = await getSignedUrl(this.s3Client, command, {
      expiresIn: PRESIGNED_URL_EXPIRE,
    });

    await this.redis.set(cacheKey, url, 'EX', PRESIGNED_URL_EXPIRE - 60);

    return url;
  }

  public async completeMultipartUpload(
    dto: CompleteUploadDto,
    userId: string,
  ): Promise<File> {
    const file = await this.fetchAndValidateFileOwner(dto.key, userId);

    if (
      file.status === FileStatus.COMPLETED ||
      file.status === FileStatus.FAILED
    ) {
      this.logger.error('Не удалось завершить загрузку');
      throw new BadRequestException('Failed to complete upload');
    }

    const command = new CompleteMultipartUploadCommand({
      Bucket: this.bucketName,
      Key: dto.key,
      UploadId: dto.uploadId,
      MultipartUpload: {
        Parts: dto.parts.sort((a, b) => a.PartNumber - b.PartNumber),
      },
    });

    await this.s3Client.send(command);

    return await this.mediaRepository.completeUpload(file.id);
  }

  public async fetchAndValidateFileOwner(
    fileKey: string,
    userId: string,
  ): Promise<File> {
    const file = await this.mediaRepository.findByKey(fileKey);

    if (!file) {
      this.logger.error('Файл не найден');
      throw new NotFoundException('File not found');
    }

    if (file.uploaderId !== userId) {
      this.logger.error('Недостаточно прав для управления загрузкой');
      throw new ForbiddenException('Not your upload');
    }

    return file;
  }

  private generateFileKey(filename: string, fileId: string): string {
    return `uploads/${fileId}/${filename}`;
  }
}
