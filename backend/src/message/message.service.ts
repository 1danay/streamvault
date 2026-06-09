import { Injectable, Logger } from '@nestjs/common';
import { MessageRepository } from './repositories';
import { CreateMessageDto, GetMessagesData } from './dto';
import { Message } from 'generated/prisma/client';
import { StreamService } from 'src/stream/stream.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly streamService: StreamService,
  ) {}

  private readonly logger = new Logger(MessageService.name);

  public async getMessages(data: GetMessagesData): Promise<Message[]> {
    await this.validateStreamExists(data.streamId);

    return await this.messageRepository.getMessages(data);
  }

  public async createMessage(
    data: CreateMessageDto,
    userId: string,
  ): Promise<Message> {
    await this.validateStreamExists(data.streamId);
    return this.messageRepository.create(data, userId);
  }

  public async validateStreamExists(streamId: string): Promise<void> {
    const stream = await this.streamService.findById(streamId);
    if (!stream) {
      throw new WsException('Stream not found');
    }
  }
}
