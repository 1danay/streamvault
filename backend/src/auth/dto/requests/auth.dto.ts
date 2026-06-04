import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class AuthDto {
  @ApiProperty({
    example: 'example@example.com',
    description: 'User email address',
  })
  @IsEmail()
  public email: string;

  @ApiProperty({
    example: 'username',
    description: 'User display name',
  })
  @IsString()
  @IsOptional()
  public username?: string;

  @ApiProperty({
    example: '12345678',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  public password: string;
}
