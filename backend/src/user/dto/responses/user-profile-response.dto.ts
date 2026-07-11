import { ApiProperty } from '@nestjs/swagger';
import { StreamResponse } from 'src/stream/dto';
import { SafeUserData } from './safe-user.dto';

export class UserProfileResponse extends SafeUserData {
  @ApiProperty({
    type: StreamResponse,
    isArray: true,
    description: 'Streams created by the user, sorted by creation date (newest first)',
  })
  streams: StreamResponse[];
}
