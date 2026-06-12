import { Message } from 'generated/prisma/client';

export function deserializeMessage(rawMessage: string): Message {
  const parsed = JSON.parse(rawMessage);
  return {
    ...parsed,
    createdAt: new Date(parsed.createdAt),
  } as Message;
}

export function serializeMessage(message: Message): string {
  return JSON.stringify(message);
}
