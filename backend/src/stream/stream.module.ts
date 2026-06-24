import { Module } from '@nestjs/common';
import { StreamService } from './stream.service';
import { StreamController } from './stream.controller';
import { StreamRepository } from './repositories';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [
    MediaModule,
    ClientsModule.registerAsync([
      {
        name: 'AMQP_SERVICE',

        inject: [ConfigService],

        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: configService.getOrThrow<string>('RABBIT_MQ_URLS').split(','),
            queue: 'main_queue',
          },
        }),
      },
    ]),
  ],
  controllers: [StreamController],
  providers: [StreamService, StreamRepository],
  exports: [StreamService],
})
export class StreamModule {}
