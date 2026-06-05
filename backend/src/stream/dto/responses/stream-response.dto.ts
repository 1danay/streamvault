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
  thumbnailUrl: string | null;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;
}
