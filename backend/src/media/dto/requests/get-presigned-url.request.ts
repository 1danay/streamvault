import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class GetPresignedUrlDto {
  @ApiProperty({
    example: 'uploads/7d7d7384-dfb0-48dd-af18-4b0bfb644892/video.mp4',
    description: 'Object key in the storage bucket',
  })
  @IsString()
  @IsNotEmpty()
  public key: string;

  @ApiProperty({
    example: 'f9b3c7d8e2a4',
    description: 'Multipart upload ID returned by the initialization endpoint',
  })
  @IsString()
  @IsNotEmpty()
  public uploadId: string;

  @ApiProperty({
    example: 1,
    description: 'Part number for the multipart upload',
  })
  @IsNumber()
  @Min(1)
  public partNumber: number;
}
