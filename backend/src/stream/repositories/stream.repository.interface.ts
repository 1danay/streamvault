import { Stream } from 'generated/prisma/client';
import { CreateStreamDto } from '../dto';

export interface IStreamRepository {
  create(dto: CreateStreamDto, userId: string): Promise<Stream>;
  findAll(): Promise<Stream[]>;
  findById(id: string): Promise<Stream | null>;
}
