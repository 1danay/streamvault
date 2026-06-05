import { Stream } from 'generated/prisma/client';

export interface IStreamRepository {
  create(dto: CreateStreamDto): Promise<Stream>;
  findAll(): Promise<Stream[]>;
  findById(id: string): Promise<Stream | null>;
  delete(id: string): Promise<void>;
}
