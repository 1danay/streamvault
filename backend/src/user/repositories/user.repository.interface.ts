import { User } from 'generated/prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';

export type CreateUserData = Omit<CreateUserDto, 'password'> & {
  passwordHash: string;
};

export interface IUsersRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(dto: CreateUserData): Promise<User>;
}
