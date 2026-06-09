import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { MessageService } from './message.service';
import { Socket, Server } from 'socket.io';
import * as cookie from 'cookie';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { CreateMessageDto, JoinStreamRequest } from './dto';
import { StreamService } from 'src/stream/stream.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
  namespace: 'chat',
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly messageService: MessageService,
    private readonly jwtService: JwtService,
    private readonly streamService: StreamService,
  ) {}

  private readonly logger = new Logger(MessageGateway.name);

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinStream')
  async handleJoinStream(
    @MessageBody() data: JoinStreamRequest,
    @ConnectedSocket() client: Socket,
  ) {
    if (client.data.activeStreamId) {
      const oldStreamId = client.data.activeStreamId;
      await client.leave(`stream_${oldStreamId}`);

      this.server.to(`stream_${oldStreamId}`).emit('sys_message', {
        text: `Пользователь ${client.data.user?.username || 'Гость'} покинул трансляцию`,
      });
    }

    const stream = await this.streamService.findById(data.streamId);

    if (!stream) {
      this.logger.error(`Прямая трансляция не существует: ${data.streamId}`);
      client.emit('error', { message: 'Stream not found' });
      return;
    }

    await client.join(`stream_${data.streamId}`);

    client.data.activeStreamId = data.streamId;

    this.server.to(`stream_${data.streamId}`).emit('sys_message', {
      text: `Пользователь ${client.data.user?.username || 'Гость'} присоединился к чату`,
    });

    this.logger.log(
      `Пользователь ${client.id} присоединился к чату трансляции ${data.streamId}`,
    );
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @MessageBody() data: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {}

  async handleConnection(client: Socket) {
    const rawCookies = client.handshake.headers.cookie;

    if (!rawCookies) {
      client.data.user = { isGuest: true };
      return;
    }

    try {
      const parsedCookies = cookie.parse(rawCookies);
      const authToken = parsedCookies['accessToken'];

      if (!authToken) {
        client.data.user = { isGuest: true };
        return;
      }

      const payload = await this.jwtService.verifyAsync(authToken);

      client.data.user = {
        id: payload.sub,
        username: payload.username,
        isGuest: false,
        expiresAt: payload.exp * 1000,
      };

      this.logger.log(`[WS] Авторизован через куки: ${client.data.user.id}`);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      client.data.user = { isGuest: true };
    }
  }

  async handleDisconnect(client: Socket) {
    const username = client.data.user?.username || 'Гость';
    const streamId = client.data.activeStreamId;

    if (streamId) {
      this.server.to(`stream_${streamId}`).emit('sys_message', {
        text: `Пользователь ${username} покинул трансляцию`,
      });
    }

    this.logger.log(`[WS] Пользователь ${client.data.user?.id} отключился`);
  }
}
