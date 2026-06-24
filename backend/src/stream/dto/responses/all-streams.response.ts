import { ApiProperty } from '@nestjs/swagger';
import { StreamResponse } from './stream-response.dto';

export class FildAllStreamsResponse {
  @ApiProperty()
  public active: StreamResponse[];

  @ApiProperty()
  public upcoming: StreamResponse[];
}
