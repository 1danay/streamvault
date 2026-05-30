import { IsEmail } from 'class-validator';

export class FindUserByEmailDto {
  @IsEmail()
  public email: string;
}
