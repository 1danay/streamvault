import { Stream } from 'generated/prisma/client';
import { CreateStreamDto, UpdateStreamDto } from '../dto';

export interface IStreamRepository {
  create(dto: CreateStreamDto, userId: string): Promise<Stream>;
  update(dto: UpdateStreamDto, streamId: string): Promise<Stream>;
  setLiveStatus(isLive: boolean, streamId: string): Promise<Stream>;
  findActiveStreams(): Promise<Stream[]>;
  findActiveByUser(userId: string): Promise<Stream[]>;
  findById(id: string): Promise<Stream | null>;
  delete(id: string): Promise<Stream>;
}
