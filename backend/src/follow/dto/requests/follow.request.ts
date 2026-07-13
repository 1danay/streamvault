import { IsUUID } from 'class-validator';

export class FollowRequestDto {
  @IsUUID()
  public targetId: string;
}

export class UpdateFollowData {
  @IsUUID()
  public followerId: string;

  @IsUUID()
  public followingId: string;
}
