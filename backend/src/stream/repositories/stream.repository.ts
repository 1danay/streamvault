import { Injectable } from '@nestjs/common';
import { IStreamRepository } from './stream.repository.interface';
import { Stream } from 'generated/prisma/client';
import { CreateStreamDto } from '../dto';
import { PrismaService } from 'src/prisma.service';

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

  public async findAll(): Promise<Stream[]> {
    return await this.prisma.stream.findMany({
      orderBy: {
        createdAt: 'desc',
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
}
