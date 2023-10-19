import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LoggingIncomingHTTPRequestInterceptor implements NestInterceptor {
  private readonly logger = new Logger(
    LoggingIncomingHTTPRequestInterceptor.name,
  );
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    this.logger.log(`[${context.getClass().name}] ${req.method} ${req.path}`);

    return next.handle();
  }
}
