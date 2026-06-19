import {
  CreateMultipartUploadCommand,
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
  CreateFileData,
  GetPresignedUrlDto,
  InitFileUploadData,
  InitFileUploadResponse,
} from './dto';
import { v4 as uuidv4 } from 'uuid';
import { MediaRepository } from './repositories';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { FileStatus } from 'generated/prisma/enums';

@Injectable()
export class MediaService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly CHUNK_SIZE = UPLOAD_CHUNK_SIZE; // 10 MB

  private readonly logger = new Logger(MediaService.name);

  constructor(
    private configService: ConfigService,
    private readonly mediaRepository: MediaRepository,
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
    const file = await this.mediaRepository.findByKey(dto.key);

    if (!file) {
      this.logger.error('Файл не найден');
      throw new NotFoundException('File not found');
    }

    if (file.uploaderId !== userId) {
      this.logger.error('Недостаточно прав для управления загрузкой');
      throw new ForbiddenException('Not your upload');
    }

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

  private generateFileKey(filename: string, fileId: string): string {
    return `uploads/${fileId}/${filename}`;
  }
}
