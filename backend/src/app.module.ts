import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service.js';
import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import { PrismaModule } from './prisma.module.js';
import { AppController } from './app.controller.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    JwtModule.register({ global: true }),
    PrismaModule,
  ],
  providers: [PrismaService],
  controllers: [AppController],
})
export class AppModule {}
