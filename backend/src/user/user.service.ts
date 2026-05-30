import { Injectable } from '@nestjs/common';
import { CreateUserData, UsersRepository } from './repositories';
import { SafeUserData } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, FindUserByEmailDto, FindUserByIdDto } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async findByEmail(dto: FindUserByEmailDto) {
    const user = await this.usersRepository.findByEmail(dto.email);

    return user;
  }

  public async findById(dto: FindUserByIdDto) {
    const user = await this.usersRepository.findById(dto.id);

    return user;
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
