import { Injectable } from '@nestjs/common';
import { Message } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { IMessageRepository } from './message.repository.interface';
import { CreateMessageDto, GetMessagesData } from '../dto';

@Injectable()
export class MessageRepository implements IMessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async create(
    data: CreateMessageDto,
    userId: string,
  ): Promise<Message> {
    return await this.prisma.message.create({
      data: {
        content: data.content,
        streamId: data.streamId,
        userId,
      },
    });
  }

  public async getMessages(data: GetMessagesData): Promise<Message[]> {
    return await this.prisma.message.findMany({
      where: {
        streamId: data.streamId,
      },
      take: data.limit,
      skip: data.offset,
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
