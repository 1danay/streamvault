import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const method = request.method;
    const query = request.query ?? {};
    const body = request.body ?? {};

    const now = Date.now();

    const queryString = Object.keys(query).length
      ? `\n  Query: ${JSON.stringify(query)}`
      : '';
    const bodyString = Object.keys(body).length
      ? `\n  Body: ${JSON.stringify(body)}`
      : '';

    this.logger.log(`--> ${method} ${queryString}${bodyString}`);

    return next.handle().pipe(
      tap({
        next: (responseData) => {
          const response = ctx.getResponse();
          const statusCode = response.statusCode;
          const delay = Date.now() - now;

          this.logger.log(
            `<-- ${method} | Status: ${statusCode} | Time: ${delay}ms`,
          );

          this.logger.debug(`Response Data: ${JSON.stringify(responseData)}`);
        },
        error: (err) => {
          const delay = Date.now() - now;
          const statusCode = err.status ?? 500;

          this.logger.error(
            `<-- ${method} | Status: ${statusCode} [Error] | Time: ${delay}ms | Message: ${err.message}`,
          );
        },
      }),
    );
  }
}
