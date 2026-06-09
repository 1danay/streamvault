import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';
import { StreamModule } from 'src/stream/stream.module';
import { MessageRepository } from './repositories';

@Module({
  imports: [StreamModule],
  providers: [MessageGateway, MessageService, MessageRepository],
})
export class MessageModule {}
