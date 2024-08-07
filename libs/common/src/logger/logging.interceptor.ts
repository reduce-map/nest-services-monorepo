import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoggerService } from '@app/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const status = error.getStatus ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        this.logger.error(`Error: ${error.message} | Path: ${request.url} | Status code: ${status}`);
        return throwError(() => error);
      }),
    );
  }
}
