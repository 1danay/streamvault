import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthDto, LoginResponse } from './dto';
import * as bcrypt from 'bcrypt';
import { User } from 'generated/prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

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

    // DEV
    this.logger.log(`Login successfull. Credentials: ${email}:${password}`);

    const { accessToken, refreshToken } =
      await this.generateTokens(existingUser);

    return {
      accessToken,
      refreshToken,
      id: existingUser.id,
      email: existingUser.email,
      username: existingUser.username,
      createdAt: existingUser.createdAt,
    };
  }

  async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    // DEV
    this.logger.log(
      `Tokens generated: ${user.id} accessToken: ${accessToken} refreshToken: ${refreshToken}`,
    );

    return { accessToken, refreshToken };
  }
}
