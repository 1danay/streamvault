import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthDto, LoginResponse } from './dto';
import * as bcrypt from 'bcrypt';
import { User } from 'generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  private readonly logger = new Logger(AuthService.name);

  public async login(dto: AuthDto): Promise<LoginResponse> {
    const { email, password } = dto;

    const existingUser = await this.userService.findForAuth(email);
    if (!existingUser) {
      this.logger.error(`Неверный email или пароль`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      this.logger.error('Invalid credentials');
      throw new UnauthorizedException('Неверный email или пароль');
    }

    // dev
    this.logger.log(`Login successfull. Credentials: ${email}:${password}`);

    return this.generateTokens(existingUser);
  }

  async generateToken(user: User) {}
}
