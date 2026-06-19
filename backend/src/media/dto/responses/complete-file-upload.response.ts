import { ApiProperty } from '@nestjs/swagger';
import { FileStatus } from 'generated/prisma/enums';

export class CompleteFileUploadResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  uploaderId: string;

  @ApiProperty()
  key: string;

  @ApiProperty({ enum: FileStatus })
  status: FileStatus;

  @ApiProperty()
  mimeType: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ nullable: true, required: false })
  uploadedAt: Date | null;
}
