import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';
import { StreamModule } from 'src/stream/stream.module';
import { MessageRepository } from './repositories';
import { MessageController } from './message.controller';

@Module({
  controllers: [MessageController],
  imports: [StreamModule],
  providers: [MessageGateway, MessageService, MessageRepository],
})
export class MessageModule {}
