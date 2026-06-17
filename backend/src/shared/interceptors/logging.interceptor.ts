import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Socket } from 'socket.io';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly httpLogger = new Logger('HTTP');
  private readonly wsLogger = new Logger('WS');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const type = context.getType();

    if (type === 'ws') {
      return this.interceptWs(context, next);
    }

    return this.interceptHttp(context, next);
  }

  private interceptHttp(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const method = request?.method ?? 'HTTP';
    const query = request?.query ?? {};
    const body = request?.body ?? {};

    const now = Date.now();
    const queryString = this.formatDetails('Query', query);
    const bodyString = this.formatDetails('Body', body);

    this.httpLogger.log(`--> ${method}${queryString}${bodyString}`);

    return next.handle().pipe(
      tap({
        next: (responseData) => {
          const response = httpContext.getResponse();
          const statusCode = response?.statusCode ?? 200;
          const delay = Date.now() - now;

          this.httpLogger.log(
            `<-- ${method} | Status: ${statusCode} | Time: ${delay}ms`,
          );
          this.httpLogger.debug(
            `Response Data: ${this.stringifyPayload(responseData)}`,
          );
        },
        error: (err: any) => {
          const delay = Date.now() - now;
          const statusCode = err?.status ?? 500;

          this.httpLogger.error(
            `<-- ${method} | Status: ${statusCode} [Error] | Time: ${delay}ms | Message: ${err?.message ?? 'Unknown error'}`,
          );
        },
      }),
    );
  }

  private interceptWs(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const wsContext = context.switchToWs();
    const client = wsContext.getClient<Socket>();
    const data = wsContext.getData();
    const handlerName = context.getHandler().name || 'wsHandler';
    const username = client?.data?.user?.username ?? 'Гость';
    const streamId = data?.streamId ?? client?.data?.activeStreamId ?? 'global';

    this.wsLogger.log(
      `[WS] ${handlerName} | User: ${username} | Stream: ${streamId} | Payload: ${this.stringifyPayload(data)}`,
    );

    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: (responseData) => {
          const delay = Date.now() - now;

          this.wsLogger.log(
            `[WS] ${handlerName} completed | Stream: ${streamId} | Time: ${delay}ms`,
          );
          this.wsLogger.debug(
            `WS Response: ${this.stringifyPayload(responseData)}`,
          );
        },
        error: (err: any) => {
          const delay = Date.now() - now;

          this.wsLogger.error(
            `[WS] ${handlerName} failed | Stream: ${streamId} | Time: ${delay}ms | Message: ${err?.message ?? 'Unknown websocket error'}`,
          );
        },
      }),
    );
  }

  private formatDetails(label: string, value: unknown): string {
    return Object.keys(value ?? {}).length
      ? `\n  ${label}: ${this.stringifyPayload(value)}`
      : '';
  }

  private stringifyPayload(value: unknown): string {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
}
