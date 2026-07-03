import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class SseNotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Sse('live-streams')
  streamLiveNotifications(): Observable<MessageEvent> {
    return this.notificationService.subscribeToStreams();
  }
}
