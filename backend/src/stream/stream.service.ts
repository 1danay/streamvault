import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { StreamRepository } from './repositories';
import { CreateStreamDto, UpdateStreamDto } from './dto';
import { Stream } from 'generated/prisma/client';

@Injectable()
export class StreamService {
  constructor(private readonly streamRepository: StreamRepository) {}

  private readonly logger = new Logger(StreamService.name);

  public async createStream(
    dto: CreateStreamDto,
    userId: string,
  ): Promise<Stream> {
    const activeStream = await this.streamRepository.findActiveByUser(userId);

    if (activeStream.length > 0) {
      this.logger.error(`У вас уже есть активная трансляция, userId=${userId}`);
      throw new BadRequestException('You already have an active live stream');
    }

    return await this.streamRepository.create(dto, userId);
  }

  public async updateStream(
    dto: UpdateStreamDto,
    streamId: string,
    userId: string,
  ): Promise<Stream> {
    await this.getStreamAndValidateOwner(streamId, userId);

    return await this.streamRepository.update(dto, streamId);
  }

  public async findById(id: string): Promise<Stream | null> {
    return await this.streamRepository.findById(id);
  }

  public async findAll(): Promise<Stream[]> {
    return await this.streamRepository.findAll();
  }

  public async deleteStream(streamId: string, userId: string): Promise<void> {
    await this.getStreamAndValidateOwner(streamId, userId);

    await this.streamRepository.delete(streamId);

    return;
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
