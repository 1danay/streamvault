import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { SafeUserData } from 'src/user/dto';

class TokensDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ...',
    description: 'JWT Authorization token (Bearer)',
  })
  public accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIx...',
    description: 'Refresh token to renew access token',
  })
  public refreshToken: string;
}

export class LoginResponse extends IntersectionType(SafeUserData, TokensDto) {}
