import { Injectable, Logger } from '@nestjs/common';
import { MessageRepository } from './repositories';
import { CreateMessageDto, GetMessagesData } from './dto';
import { Message } from 'generated/prisma/client';
import { StreamService } from 'src/stream/stream.service';
import { WsException } from '@nestjs/websockets';
import { RedisService } from 'src/redis/redis.service';
import { DEFAULT_MESSAGE_LIMIT } from './constants';
import { deserializeMessage, serializeMessage } from './helpers';

const CACHE_SIZE = DEFAULT_MESSAGE_LIMIT; // 50
const CACHE_TTL = 60 * 60 * 24; // 1 day

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly streamService: StreamService,
    private readonly redis: RedisService,
  ) {}

  private readonly logger = new Logger(MessageService.name);

  public async getMessages(data: GetMessagesData): Promise<Message[]> {
    const cacheKey = this.getMessageCacheKey(data.streamId);
    const { offset, limit } = data;

    const canUseCache = offset + limit <= CACHE_SIZE;

    if (canUseCache) {
      try {
        const cached = await this.redis.lrange(
          cacheKey,
          offset,
          offset + limit - 1,
        );
        if (cached.length > 0) {
          return cached.map((msg) => deserializeMessage(msg));
        }
      } catch (err) {
        this.logger.warn(`Redis read failed, falling back to DB: ${err}`);
      }
    }

    await this.validateStreamExists(data.streamId);
    const dbMessages = await this.messageRepository.getMessages(data);

    if (offset === 0 && dbMessages.length > 0) {
      this.warmCache(cacheKey, dbMessages).catch((err) =>
        this.logger.warn(`Failed to warm cache: ${err}`),
      );
    }

    return dbMessages;
  }

  public async createMessage(
    data: CreateMessageDto,
    userId: string,
  ): Promise<Message> {
    await this.validateStreamExists(data.streamId);

    const messagePayload: Message = {
      id: crypto.randomUUID(),
      content: data.content,
      createdAt: new Date(),
      streamId: data.streamId,
      userId,
    };

    await this.messageRepository.create(messagePayload);

    const cacheKey = this.getMessageCacheKey(data.streamId);
    try {
      await this.redis
        .multi()
        .lpush(cacheKey, serializeMessage(messagePayload))
        .ltrim(cacheKey, 0, CACHE_SIZE - 1)
        .expire(cacheKey, CACHE_TTL)
        .exec();
    } catch (err) {
      this.logger.warn(`Failed to update message cache: ${err}`);
    }

    return messagePayload;
  }

  public async validateStreamExists(streamId: string): Promise<void> {
    const stream = await this.streamService.findById(streamId);
    if (!stream) {
      throw new WsException('Stream not found');
    }
  }

  private async warmCache(
    cacheKey: string,
    messages: Message[],
  ): Promise<void> {
    const pipeline = this.redis.pipeline();
    messages.slice(0, CACHE_SIZE).forEach((msg) => {
      pipeline.rpush(cacheKey, serializeMessage(msg));
    });
    pipeline.expire(cacheKey, CACHE_TTL);
    await pipeline.exec();
  }

  private getMessageCacheKey(streamId: string): string {
    return `stream:${streamId}:messages`;
  }
}
