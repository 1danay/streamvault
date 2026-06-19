import { File } from 'generated/prisma/client';
import { CreateFileData } from '../dto';

export interface IMediaRepository {
  create(data: CreateFileData, userId: string): Promise<File>;
  findByKey(key: string): Promise<File | null>;
}
