import { Injectable, Logger } from '@nestjs/common';
import { MessageRepository } from './repositories';
import { GetMessagesData } from './dto';
import { Message } from 'generated/prisma/client';

@Injectable()
export class MessageService {
  constructor(private readonly messageRepository: MessageRepository) {}

  private readonly logger = new Logger(MessageService.name);

  public async getMessages(data: GetMessagesData): Promise<Message[]> {
    return await this.messageRepository.getMessages(data);
  }
}
