import { Injectable } from '@nestjs/common';
import { CreateUserData, IUsersRepository } from './user.repository.interface';
import { User } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async create(dto: CreateUserData): Promise<User> {
    return await this.prisma.user.create({
      data: {
        email: dto.email,
        password: dto.passwordHash,
        username: dto.username,
      },
    });
  }

  public async findById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  public async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
