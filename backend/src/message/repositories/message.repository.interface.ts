import { Message } from 'generated/prisma/client';
import { GetMessagesData } from '../dto';

export interface IMessageRepository {
  create(data: Message): Promise<Message>;
  getMessages(dto: GetMessagesData): Promise<Message[]>;
}
