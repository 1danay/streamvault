import { IsUUID } from 'class-validator';

export class JoinStreamRequest {
  @IsUUID()
  streamId: string;
}
