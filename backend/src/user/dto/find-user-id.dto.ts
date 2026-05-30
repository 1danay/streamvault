import { IsNotEmpty, IsUUID } from 'class-validator';

export class FindUserByIdDto {
  @IsNotEmpty()
  @IsUUID()
  public id: string;
}
