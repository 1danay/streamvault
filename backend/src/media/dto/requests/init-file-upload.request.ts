import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class InitFileUploadData {
  @ApiProperty({ example: 'video.mp4', description: 'File name' })
  @IsString()
  @IsNotEmpty()
  public filename: string;

  @ApiProperty({ example: 'video/mp4', description: 'MIME-type of file' })
  @IsString()
  @IsNotEmpty()
  public contentType: string;
}
