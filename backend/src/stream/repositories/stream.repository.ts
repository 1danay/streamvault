import { Injectable } from '@nestjs/common';
import { IStreamRepository } from './stream.repository.interface';
import { Stream } from 'generated/prisma/client';
import { CreateStreamDto, UpdateStreamDto } from '../dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StreamRepository implements IStreamRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async create(dto: CreateStreamDto, userId: string): Promise<Stream> {
    return await this.prisma.stream.create({
      data: {
        title: dto.title,
        description: dto.description,
        isLive: true,
        thumbnailUrl: dto.thumbnailUrl,
        userId,
      },
    });
  }

  public async update(dto: UpdateStreamDto, streamId: string): Promise<Stream> {
    return await this.prisma.stream.update({
      where: { id: streamId },
      data: {
        title: dto.title,
        description: dto.description,
        thumbnailUrl: dto.thumbnailUrl,
      },
    });
  }

  public async setLiveStatus(
    isLive: boolean,
    streamId: string,
  ): Promise<Stream> {
    return await this.prisma.stream.update({
      where: { id: streamId },
      data: { isLive },
    });
  }

  public async findActiveStreams(): Promise<Stream[]> {
    return await this.prisma.stream.findMany({
      where: {
        isLive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  public async findActiveByUser(userId: string): Promise<Stream[]> {
    return await this.prisma.stream.findMany({
      where: {
        userId: userId,
        isLive: true,
      },
    });
  }

  public async findById(id: string): Promise<Stream | null> {
    return await this.prisma.stream.findUnique({
      where: {
        id,
      },
    });
  }

  public async delete(id: string): Promise<Stream> {
    return await this.prisma.stream.delete({
      where: {
        id,
      },
    });
  }
}
