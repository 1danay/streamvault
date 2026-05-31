import { ApiProperty } from '@nestjs/swagger';
import { User } from 'generated/prisma/client';

export class SafeUserData implements Omit<User, 'password'> {
  @ApiProperty({
    example: '6f9c9b0e-8b8b-4a5c-9c1a-2b3c4d5e6f7g',
    description: 'Unique user identifier(UUID)',
  })
  id: string;

  @ApiProperty({
    example: 'example@example.com',
    description: 'User email address',
  })
  email: string;

  @ApiProperty({
    example: 'username',
    description: 'Username',
  })
  username: string;

  @ApiProperty({
    example: '2026-05-30T15:00:00.000Z',
    description: 'Account creating date',
  })
  createdAt: Date;
}
