import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor.js';
import cookieParser from 'cookie-parser';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const logger = new Logger();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.use(cookieParser());

  app.enableCors({
    origin: config.getOrThrow<string>('HTTP_CORS').split(','),
    credentials: true,
  });

  app.useGlobalInterceptors(new LoggingInterceptor());

  const rabbitMqUrls = config.getOrThrow<string>('RABBIT_MQ_URLS').split(',');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: rabbitMqUrls,
      queue: 'main_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Streamvault API')
    .setDescription('Streamvault API methods and structures')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('/docs', app, swaggerDocument, {
    yamlDocumentUrl: '/openapi.yaml',
  });

  const port = config.getOrThrow<number>('HTTP_PORT');
  const host = config.getOrThrow<string>('HTTP_HOST');

  await app.startAllMicroservices();
  await app.listen(port);

  logger.log(`🚀 Gateway started: ${host}`);
  logger.log(`📚 Swagger: ${host}/docs`);
}
bootstrap();
