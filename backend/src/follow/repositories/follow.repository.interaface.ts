import type { Follow, User } from 'generated/prisma/client';
import { UpdateFollowData } from '../dto/requests/follow.request';

export type FollowWithUser = Follow & { follower: User };
export type FollowingWithUser = Follow & { following: User };

export interface IFollowRepository {
  follow(data: UpdateFollowData): Promise<Follow>;
  delete(data: UpdateFollowData): Promise<void>;
  findOne(data: UpdateFollowData): Promise<Follow | null>;
  findFollowers(userId: string): Promise<FollowWithUser[]>;
  findFollowing(userId: string): Promise<FollowingWithUser[]>;
}
