import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    example: 'example@example.com',
    description: 'User email address',
  })
  @IsEmail()
  public email: string;

  @ApiProperty({
    example: 'username',
    description: 'Username',
  })
  @IsString()
  @IsNotEmpty()
  public username: string;

  @ApiProperty({
    example: '12345678',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  public password: string;
}
