import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  CompleteFileUploadResponse,
  CompleteUploadDto,
  GetPresignedUrlDto,
  InitFileUploadData,
  InitFileUploadResponse,
} from './dto';
import { CurrentUser } from 'src/shared/decorators';
import { MediaService } from './media.service';
import { File } from 'generated/prisma/client';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('init')
  @ApiOperation({ summary: 'Initialize multipart upload' })
  @ApiResponse({ status: 201, type: InitFileUploadResponse })
  @HttpCode(201)
  async initializeMultipartUpload(
    @Body() dto: InitFileUploadData,
    @CurrentUser('id') userId: string,
  ): Promise<InitFileUploadResponse> {
    return await this.mediaService.initFileUpload(dto, userId);
  }

  @Post('part-url')
  @ApiOperation({ summary: 'Get presigned url for file part' })
  @ApiResponse({ status: 200, type: String })
  @HttpCode(200)
  async getPresignedUrl(
    @Body() dto: GetPresignedUrlDto,
    @CurrentUser('id') userId: string,
  ): Promise<string> {
    return await this.mediaService.getPartPresignedUrl(dto, userId);
  }

  @Post('complete-upload')
  @ApiOperation({ summary: 'Complete multipart upload' })
  @ApiResponse({ status: 200, type: CompleteFileUploadResponse })
  @HttpCode(200)
  async completeUpload(
    @Body() dto: CompleteUploadDto,
    @CurrentUser('id') userId: string,
  ): Promise<File> {
    return await this.mediaService.completeMultipartUpload(dto, userId);
  }
}
