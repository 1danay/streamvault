import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1024)
  public content: string;

  @IsUUID()
  @IsNotEmpty()
  public streamId: string;
}
