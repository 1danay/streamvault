import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: any;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get('isPublic', context.getHandler());

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const token = request.cookies?.['accessToken'];

    if (!token) {
      throw new UnauthorizedException('Not authorized');
    }

    try {
      (request as AuthenticatedRequest).user = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
      });
      return true;
    } catch {
      throw new UnauthorizedException('Token is invalid or expired');
    }
  }
}
