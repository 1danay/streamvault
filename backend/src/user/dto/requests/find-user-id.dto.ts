import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class FindUserByIdDto {
  @ApiProperty({
    example: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
    description: 'User unique identifier',
  })
  @IsNotEmpty()
  @IsUUID()
  public id: string;
}
