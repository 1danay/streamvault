import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class FindUserByEmailDto {
  @ApiProperty({
    example: 'example@example.com',
    description: 'User email address',
  })
  @IsEmail()
  public email: string;
}
