import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import {
  DEFAULT_MESSAGE_LIMIT,
  DEFAULT_MESSAGE_OFFSET,
} from 'src/message/constants';

export class GetMessagesData {
  @IsUUID()
  public streamId: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  public limit: number = DEFAULT_MESSAGE_LIMIT;

  @IsOptional()
  @IsInt()
  @Min(0)
  public offset: number = DEFAULT_MESSAGE_OFFSET;
}
