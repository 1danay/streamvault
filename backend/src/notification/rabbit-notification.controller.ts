import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { StreamStartedEvent } from 'src/shared/interfaces/events';

@Controller()
export class RabbitNotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('stream_started')
  handleStreamStarted(@Payload() data: StreamStartedEvent) {
    this.notificationService.emitStreamStarted(data);
  }
}
