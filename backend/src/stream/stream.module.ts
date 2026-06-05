import { Module } from '@nestjs/common';
import { StreamService } from './stream.service';
import { StreamController } from './stream.controller';
import { StreamRepository } from './repositories';

@Module({
  controllers: [StreamController],
  providers: [StreamService, StreamRepository],
})
export class StreamModule {}
