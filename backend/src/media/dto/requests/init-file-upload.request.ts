import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsMimeType,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ONE_MB_IN_BYTES } from 'src/media/constants';

export class InitFileUploadData {
  @ApiProperty({ example: 'video.mp4', description: 'File name' })
  @IsString()
  @IsNotEmpty()
  public filename: string;

  @ApiProperty({ example: 'video/mp4', description: 'MIME-type of file' })
  @IsString()
  @IsMimeType()
  @IsIn(['video/mp4', 'video/webm', 'video/quicktime'])
  public contentType: string;

  @ApiProperty({ example: ONE_MB_IN_BYTES, description: 'File size in bytes' })
  @IsNumber()
  @Min(1)
  @Max(1024 * 1024 * 1024) // 1GB
  fileSize: number;
}
