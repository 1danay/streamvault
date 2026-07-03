import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { StreamRepository } from './repositories';
import {
  CreateStreamDto,
  FildAllStreamsResponse,
  StreamResponse,
  UpdateStreamDto,
} from './dto';
import { Stream } from 'generated/prisma/client';
import { ClientProxy } from '@nestjs/microservices';
import { RedisService } from 'src/redis/redis.service';
import { Cron } from '@nestjs/schedule';
import { MediaService } from 'src/media/media.service';

@Injectable()
export class StreamService {
  constructor(
    @Inject('AMQP_SERVICE') private client: ClientProxy,
    private readonly streamRepository: StreamRepository,
    private readonly redis: RedisService,
    private readonly mediaService: MediaService,
  ) {}

  private readonly logger = new Logger(StreamService.name);

  @Cron('0 * * * * *') // 0 second of every minute
  async handleStartStreams() {
    const updatedStreams = await this.streamRepository.startLiveStreams();
    await this.redis.del('streams:all');

    for (const stream of updatedStreams) {
      await this.redis.del(`stream:${stream.id}`);
    }
  }

  public async createStream(
    dto: CreateStreamDto,
    userId: string,
  ): Promise<StreamResponse> {
    const newStream = await this.streamRepository.create(dto, userId);
    await this.redis.del('streams:all');

    const response = await this.toResponse(newStream);

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

    return response;
  }

  public async updateStream(
    dto: UpdateStreamDto,
    streamId: string,
    userId: string,
  ): Promise<StreamResponse> {
    if (dto.scheduledAt) this.validateScheduledDate(dto.scheduledAt);
    await this.getStreamAndValidateOwner(streamId, userId);

    const updatedStream = await this.streamRepository.update(dto, streamId);
    await this.redis.del(`stream:${updatedStream.id}`);
    await this.redis.del('streams:all');

    return await this.toResponse(updatedStream);
  }

  public async findById(id: string): Promise<StreamResponse | null> {
    const cacheKey = `stream:${id}`;

    const cachedStream = await this.redis.get(cacheKey);
    if (cachedStream) {
      const stream = JSON.parse(cachedStream) as Stream;
      return this.toResponse(stream);
    }

    const stream = await this.streamRepository.findById(id);
    if (!stream) return null;

    await this.redis.set(cacheKey, JSON.stringify(stream), 'EX', 300);
    return await this.toResponse(stream);
  }

  public async findAll(): Promise<FildAllStreamsResponse> {
    const cacheKey = 'streams:all';

    const cachedData = await this.redis.get(cacheKey);
    if (cachedData) {
      this.logger.log('Данные для главной страницы взяты из Redis кэша');
      return JSON.parse(cachedData) as FildAllStreamsResponse;
    }

    const [activeStreams, upcomingStreams] = await Promise.all([
      this.streamRepository.findActiveStreams(),
      this.streamRepository.findUpcomingStreams(),
    ]);

    const active = await this.toResponseMany(activeStreams);
    const upcoming = await this.toResponseMany(upcomingStreams);

    const response: FildAllStreamsResponse = {
      active,
      upcoming,
    };

    await this.redis.set(cacheKey, JSON.stringify(response), 'EX', 120);

    return response;
  }

  public async deleteStream(streamId: string, userId: string): Promise<void> {
    await this.getStreamAndValidateOwner(streamId, userId);

    await this.streamRepository.delete(streamId);

    await this.redis.del(`stream:${streamId}`);
    await this.redis.del('streams:all');

    return;
  }

  public async endStream(
    streamId: string,
    userId: string,
  ): Promise<StreamResponse> {
    const stream = await this.getStreamAndValidateOwner(streamId, userId);

    if (!stream.isLive) {
      throw new BadRequestException('Stream is already ended');
    }

    const updatedStream = await this.streamRepository.setLiveStatus(
      false,
      streamId,
    );

    await this.redis.del(`stream:${updatedStream.id}`);
    await this.redis.del('streams:all');
    return await this.toResponse(updatedStream);
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

  private validateScheduledDate(scheduledAt: string) {
    const now = new Date();
    const scheduled = new Date(scheduledAt);

    if (isNaN(scheduled.getTime())) {
      this.logger.error('Некорректная дата премьеры');
      throw new BadRequestException('Invalid scheduled date');
    }

    if (scheduled <= now) {
      this.logger.error('Некорректная дата премьеры: дата в прошлом');
      throw new BadRequestException('Scheduled date must be in the future');
    }

    const maxDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    maxDate.setMonth(maxDate.getMonth() + 1);

    if (scheduled > maxDate) {
      this.logger.error(
        'Некорректная дата премьеры: дата больше чем через месяц',
      );
      throw new BadRequestException('Scheduled date must be within one month');
    }
  }

  private async toResponse(stream: Stream): Promise<StreamResponse> {
    const thumbnailUrl = stream.thumbnailFileId
      ? await this.mediaService.getFileUrl(stream.thumbnailFileId)
      : null;

    return {
      ...stream,
      thumbnailUrl,
    };
  }

  private async toResponseMany(streams: Stream[]): Promise<StreamResponse[]> {
    return Promise.all(streams.map((s) => this.toResponse(s)));
  }
}
