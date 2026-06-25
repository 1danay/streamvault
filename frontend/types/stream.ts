export interface Stream {
  id: string;
  title: string;
  description: string | null;
  isLive: boolean;
  thumbnailUrl: string | null;
  userId: string;
  createdAt: Date;
  scheduledAt: Date;
  startedAt: Date | null;
  fileId: string | null;
}

export interface FindAllStreamsResponse {
  active: Stream[];
  upcoming: Stream[];
}
