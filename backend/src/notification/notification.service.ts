import { Injectable } from '@nestjs/common';
import { map, Observable, Subject } from 'rxjs';
import { StreamStartedEvent } from 'src/shared/interfaces/events';

@Injectable()
export class NotificationService {
  private readonly streamNotifications$ = new Subject<StreamStartedEvent>();

  public emitStreamStarted(stream: StreamStartedEvent) {
    console.log(`stream_started, streamId=${stream.id}`);

    this.streamNotifications$.next(stream);
  }

  public subscribeToStreams(): Observable<{
    data: Omit<StreamStartedEvent, 'isLive'>;
  }> {
    return this.streamNotifications$.asObservable().pipe(
      map((stream) => ({
        data: {
          id: stream.id,
          title: stream.title,
          description: stream.description,
          userId: stream.userId,
          createdAt: stream.createdAt,
          scheduledAt: stream.scheduledAt,
        },
      })),
    );
  }
}
