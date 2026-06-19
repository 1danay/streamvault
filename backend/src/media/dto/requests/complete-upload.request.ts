import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class FilePartDto {
  @ApiProperty({
    example: 1,
    description: 'Part number of the multipart upload',
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  public PartNumber: number;

  @ApiProperty({
    example: '"etag-value"',
    description: 'ETag returned by the storage service for this part',
  })
  @IsString()
  @IsNotEmpty()
  public Etag: string;
}

export class CompleteUploadDto {
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
    type: [FilePartDto],
    description: 'List of completed multipart upload parts',
    example: [
      {
        partNumber: 1,
        etag: '"etag-value"',
      },
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => FilePartDto)
  public parts: FilePartDto[];
}
