import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('stream_started')
  async handeStreamStarted(@Payload() data: any) {}
}
