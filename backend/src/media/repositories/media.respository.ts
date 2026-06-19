import { Injectable } from '@nestjs/common';
import { IMediaRepository } from './media.repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFileData } from '../dto';
import { File } from 'generated/prisma/client';

@Injectable()
export class MediaRepository implements IMediaRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async create(data: CreateFileData, userId: string): Promise<File> {
    return await this.prisma.file.create({
      data: {
        id: data.id,
        key: data.key,
        mimeType: data.mimeType,
        uploaderId: userId,
      },
    });
  }

  public async findByKey(key: string): Promise<File | null> {
    return await this.prisma.file.findUnique({
      where: {
        key,
      },
    });
  }
}
