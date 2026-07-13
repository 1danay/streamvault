export interface UserEntity {
  id: string;
  email: string;
  username: string;
  avatarFileId: string | null;
  avatarFileUrl: string | null;
  createdAt: Date;
}
