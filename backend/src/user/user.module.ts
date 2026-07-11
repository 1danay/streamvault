import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UsersRepository } from './repositories';
import { MediaModule } from 'src/media/media.module';
import { StreamModule } from 'src/stream/stream.module';

@Module({
  imports: [MediaModule, StreamModule],
  controllers: [UserController],
  providers: [UserService, UsersRepository],
  exports: [UserService],
})
export class UserModule {}
