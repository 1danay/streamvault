import { ApiProperty } from '@nestjs/swagger';

export class MessageEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  streamId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;
}
