import { ApiProperty } from '@nestjs/swagger';

export class StreamResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description: string | null;

  @ApiProperty()
  isLive: boolean;

  @ApiProperty({ required: false })
  thumbnailFileId: string | null;

  @ApiProperty({ required: false })
  thumbnailUrl: string | null;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  scheduledAt: Date | null;

  @ApiProperty({ required: false })
  startedAt: Date | null;

  @ApiProperty({ required: false })
  streamFileId: string | null;
}
