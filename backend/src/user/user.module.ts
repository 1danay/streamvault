import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UsersRepository } from './repositories';

@Module({
  controllers: [UserController],
  providers: [UserService, UsersRepository],
  exports: [UserService],
})
export class UserModule {}
