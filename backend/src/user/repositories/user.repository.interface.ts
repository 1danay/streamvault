import { User } from 'generated/prisma/client';
import { CreateUserDto } from '../dto';

export type CreateUserData = Omit<CreateUserDto, 'password'> & {
  passwordHash: string;
};

export type UpdateProfileData = {
  username?: string;
  avatarFileId?: string | null;
};

export interface IUsersRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(dto: CreateUserData): Promise<User>;
  update(id: string, data: UpdateProfileData): Promise<User>;
}
