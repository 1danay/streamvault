import {
  Injectable,
  Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService
  extends Redis
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger();

  public constructor(private readonly configService: ConfigService) {
    super({
      username: configService.getOrThrow<string>('REDIS_USER'),
      password: configService.getOrThrow<string>('REDIS_PASSWORD'),
      host: configService.getOrThrow<string>('REDIS_HOST'),
      port: configService.getOrThrow<number>('REDIS_PORT'),
      maxRetriesPerRequest: 5,
      enableOfflineQueue: true,
    });
  }

  public async onModuleInit() {
    const start = Date.now();

    this.logger.log('Initializing redis connection...');

    this.on('connecting', () => {
      this.logger.log('Connecting to redis');
    });

    this.on('ready', () => {
      const ms = Date.now() - start;
      this.logger.log(`Redis connection established (time=${ms}ms)`);
    });

    this.on('error', (err) => {
      this.logger.error('Failed to connect to redis: ', {
        error: err.message ?? err,
      });
    });

    this.on('close', () => {
      this.logger.warn('Redis connection closed');
    });

    this.on('reconnecting', () => {
      this.logger.log('Redis reconnecting...');
    });
  }

  public async onModuleDestroy() {
    this.logger.log('Closing redis connection...');

    try {
      await this.quit();

      this.logger.log('Redis connection closed');
    } catch (err) {
      this.logger.error('Error closing redis connection: ', err);
    }
  }
}
