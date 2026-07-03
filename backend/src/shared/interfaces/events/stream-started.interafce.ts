export interface StreamStartedEvent {
  id: string;
  title: string;
  description?: string;
  isLive: boolean;
  userId: string;
  createdAt: string;
  scheduledAt: string;
}
