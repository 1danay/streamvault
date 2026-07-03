import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SseNotificationController } from './sse-notification.controller';
import { RabbitNotificationController } from './rabbit-notification.controller';

@Module({
  controllers: [RabbitNotificationController, SseNotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
