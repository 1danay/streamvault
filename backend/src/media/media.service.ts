import { CreateMultipartUploadCommand, S3Client } from '@aws-sdk/client-s3';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UPLOAD_CHUNK_SIZE } from './constants';
import { ConfigService } from '@nestjs/config';
import {
  CreateFileData,
  InitFileUploadData,
  InitFileUploadResponse,
} from './dto';
import { v4 as uuidv4 } from 'uuid';
import { MediaRepository } from './repositories';

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

  private generateFileKey(filename: string, fileId: string): string {
    return `uploads/${fileId}/${filename}`;
  }
}
