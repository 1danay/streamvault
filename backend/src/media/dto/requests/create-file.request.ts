import { IsMimeType, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateFileData {
  @IsUUID()
  public id: string;

  @IsString()
  @IsNotEmpty()
  public key: string;

  @IsString()
  @IsMimeType()
  public mimeType: string;
}
