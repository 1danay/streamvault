import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthDto, AuthResponse } from './dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from 'generated/prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SafeUserData } from 'src/user/dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  public async login(dto: AuthDto, res: Response): Promise<AuthResponse> {
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
      this.logger.error('Неверный email или пароль');
      throw new UnauthorizedException('Invalid credentials');
    }

    // DEV
    this.logger.log(`Login successfull. Credentials: ${email}:${password}`);

    const { accessToken, refreshToken } = await this.generateTokens(
      existingUser,
      res,
    );

    return {
      accessToken,
      refreshToken,
      id: existingUser.id,
      email: existingUser.email,
      username: existingUser.username,
      createdAt: existingUser.createdAt,
    };
  }

  public async register(dto: AuthDto, res: Response): Promise<AuthResponse> {
    if (!dto.username) {
      this.logger.error('Username должен быть указан');
      throw new BadRequestException('Username should be provided');
    }

    const { email, username, password } = dto;

    const existingUser = await this.userService.findForAuth(email);
    if (existingUser) {
      this.logger.error(
        `Пользователь с таким адресом электронной почты уже существует: ${email}`,
      );
      throw new ConflictException('User with this email already exists');
    }

    let newUser: SafeUserData | null;

    try {
      newUser = await this.userService.createUser({
        email,
        username,
        password,
      });
    } catch (e) {
      if (
        // Unique constraint error
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        this.logger.error(
          `Пользователь с таким username уже существует: ${username}`,
        );
        throw new ConflictException('User with this username already exists');
      }
      throw e;
    }

    const { accessToken, refreshToken } = await this.generateTokens(
      newUser,
      res,
    );

    return {
      accessToken,
      refreshToken,
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      createdAt: newUser.createdAt,
    };
  }

  private async generateTokens(user: SafeUserData, res: Response) {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

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

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/auth/refresh',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // DEV
    this.logger.log(
      `Tokens generated: ${user.id} accessToken: ${accessToken} refreshToken: ${refreshToken}`,
    );

    return { accessToken, refreshToken };
  }
}
