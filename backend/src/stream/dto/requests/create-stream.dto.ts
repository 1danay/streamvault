import { ApiProperty } from '@nestjs/swagger';
import {
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateStreamDto {
  @ApiProperty({
    example: 'My first gaming stream',
    description: 'The title of the stream (maximum 30 characters)',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  public title: string;

  @ApiProperty({
    example: 'Playing some horror games tonight, come join!',
    description: 'Optional description of the stream (maximum 255 characters)',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  public description: string;

  @ApiProperty({
    example: 'https://my-bucket.s3.amazonaws.com/thumbnails/stream-123.jpg',
    description:
      'URL of the stream thumbnail. Uses default placeholder if omitted.',
    required: false,
  })
  @IsString()
  @IsOptional()
  public thumbnailUrl: string;

  @ApiProperty({
    example: '2026-06-20T18:00:00Z',
    description: 'ISO 8601 date-time when the stream is scheduled',
  })
  @IsISO8601()
  public scheduledAt: string;
}
