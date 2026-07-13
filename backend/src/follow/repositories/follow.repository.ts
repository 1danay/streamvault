import { Injectable } from '@nestjs/common';
import {
  FollowingWithUser,
  FollowWithUser,
  IFollowRepository,
} from './follow.repository.interaface';
import { Follow } from 'generated/prisma/client';
import { UpdateFollowData } from '../dto/requests/follow.request';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FollowRepository implements IFollowRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async follow(data: UpdateFollowData): Promise<Follow> {
    return await this.prisma.follow.create({
      data: {
        followerId: data.followerId,
        followingId: data.followingId,
      },
    });
  }

  public async delete(data: UpdateFollowData): Promise<void> {
    await this.prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: data.followerId,
          followingId: data.followingId,
        },
      },
    });
  }

  public async findOne(data: UpdateFollowData): Promise<Follow | null> {
    return await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: data.followerId,
          followingId: data.followingId,
        },
      },
    });
  }

  public async findFollowers(userId: string): Promise<FollowWithUser[]> {
    return await this.prisma.follow.findMany({
      where: {
        followingId: userId,
      },
      include: {
        follower: true,
      },
    });
  }

  public async findFollowing(userId: string): Promise<FollowingWithUser[]> {
    return await this.prisma.follow.findMany({
      where: { followerId: userId },
      include: { following: true },
    });
  }
}
