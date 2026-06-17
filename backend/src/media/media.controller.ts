import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InitFileUploadData, InitFileUploadResponse } from './dto';
import { CurrentUser } from 'src/shared/decorators';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @ApiOperation({ summary: 'Initialize multipart upload' })
  @ApiResponse({ status: 201, type: InitFileUploadResponse })
  @HttpCode(201)
  async initializeMultipartUpload(
    @Body() dto: InitFileUploadData,
    @CurrentUser('id') userId: string,
  ): Promise<InitFileUploadResponse> {
    return await this.mediaService.initFileUpload(dto, userId);
  }
}
