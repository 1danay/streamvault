import { Message } from 'generated/prisma/client';
import { CreateMessageDto, GetMessagesData } from '../dto';

export interface IMessageRepository {
  create(dto: CreateMessageDto, userId: string): Promise<Message>;
  getMessages(dto: GetMessagesData): Promise<Message[]>;
}
