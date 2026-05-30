import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserData, UsersRepository } from './repositories';
import { SafeUserData } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async findById(id: string): Promise<SafeUserData> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: passwordHash, ...safeUser } = user;
    return safeUser;
  }

  public async findByEmail(email: string): Promise<SafeUserData> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: passwordHash, ...safeUser } = user;
    return safeUser;
  }
  public async createUser(dto: CreateUserDto): Promise<SafeUserData> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const data: CreateUserData = {
      email: dto.email,
      username: dto.username,
      passwordHash: hashedPassword,
    };

    const user = await this.usersRepository.create(data);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;

    return safeUser;
  }
}
