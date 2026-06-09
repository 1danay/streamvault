import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import {
  DEFAULT_MESSAGE_LIMIT,
  DEFAULT_MESSAGE_OFFSET,
} from 'src/message/constants';

export class GetMessagesData {
  @ApiProperty({
    example: '1a1d5618-85bb-4f0d-9fb2-d46d5b99ea9a',
    description: 'Target stream identifier',
  })
  @IsUUID()
  public streamId: string;

  @ApiProperty({
    example: 50,
    description: 'Messages limit',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  public limit: number = DEFAULT_MESSAGE_LIMIT;

  @ApiProperty({
    example: 20,
    description: 'Messages offset',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  public offset: number = DEFAULT_MESSAGE_OFFSET;
}
