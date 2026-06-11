import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { StreamRepository } from './repositories';
import { CreateStreamDto, UpdateStreamDto } from './dto';
import { Stream } from 'generated/prisma/client';
import { ClientProxy } from '@nestjs/microservices';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class StreamService {
  constructor(
    @Inject('AMQP_SERVICE') private client: ClientProxy,
    private readonly streamRepository: StreamRepository,
    private readonly redis: RedisService,
  ) {}

  private readonly logger = new Logger(StreamService.name);

  public async createStream(
    dto: CreateStreamDto,
    userId: string,
  ): Promise<Stream> {
    const activeStream = await this.streamRepository.findActiveByUser(userId);

    if (activeStream.length > 0) {
      this.logger.error(
        `У вас уже есть активная трансляция, userId=${userId} streamId=${activeStream[0].id}`,
      );
      throw new BadRequestException('You already have an active live stream');
    }

    const newStream = await this.streamRepository.create(dto, userId);

    const cacheKey = 'streams:all';
    await this.redis.del(cacheKey);

    try {
      this.client.emit('stream_started', newStream);

      this.logger.log(
        `Событие stream_started отправлено для streamId=${newStream.id}`,
      );
    } catch (err) {
      this.logger.error(
        `Не удалось отправить событие в RabbitMQ: ${err.message}`,
      );
    }

    return newStream;
  }

  public async updateStream(
    dto: UpdateStreamDto,
    streamId: string,
    userId: string,
  ): Promise<Stream> {
    await this.getStreamAndValidateOwner(streamId, userId);

    const updatedStream = await this.streamRepository.update(dto, streamId);

    await this.redis.del(`stream:${updatedStream.id}`);
    await this.redis.del('streams:all');

    return updatedStream;
  }

  public async findById(id: string): Promise<Stream | null> {
    const cacheKey = `stream:${id}`;

    const cachedStream = await this.redis.get(cacheKey);
    if (cachedStream) {
      return JSON.parse(cachedStream) as Stream;
    }

    const stream = await this.streamRepository.findById(id);

    if (stream) {
      await this.redis.set(cacheKey, JSON.stringify(stream), 'EX', 300);
    }

    return stream;
  }

  public async findAll(): Promise<Stream[]> {
    const cacheKey = 'streams:all';

    const cachedStreams = await this.redis.get(cacheKey);

    if (cachedStreams) {
      this.logger.log('Данные findAll взяты из Redis кэша');
      return JSON.parse(cachedStreams) as Stream[];
    }

    const streams = await this.streamRepository.findActiveStreams();

    await this.redis.set(cacheKey, JSON.stringify(streams), 'EX', 120);

    return streams;
  }

  public async deleteStream(streamId: string, userId: string): Promise<void> {
    await this.getStreamAndValidateOwner(streamId, userId);

    await this.streamRepository.delete(streamId);

    await this.redis.del(`stream:${streamId}`);
    await this.redis.del('streams:all');

    return;
  }

  public async endStream(streamId: string, userId: string): Promise<Stream> {
    await this.getStreamAndValidateOwner(streamId, userId);

    const updatedStream = await this.streamRepository.setLiveStatus(
      false,
      streamId,
    );

    await this.redis.del(`stream:${updatedStream.id}`);
    await this.redis.del('streams:all');

    return updatedStream;
  }

  private async getStreamAndValidateOwner(
    streamId: string,
    userId: string,
  ): Promise<Stream> {
    const stream = await this.streamRepository.findById(streamId);

    if (!stream) {
      this.logger.error(`Трансляции с ID ${streamId} не существует`);
      throw new NotFoundException('Live stream does not exist');
    }

    if (stream.userId !== userId) {
      this.logger.error(
        `Пользователь ${userId} пытался изменить чужой стрим ${streamId}`,
      );
      throw new ForbiddenException('Insufficient permissions to manage stream');
    }

    return stream;
  }
}
