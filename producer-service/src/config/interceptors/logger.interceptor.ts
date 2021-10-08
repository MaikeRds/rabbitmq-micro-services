import {
  Injectable,
  Inject,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
  LoggerService,
  Logger,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    this.log(request);
    return next.handle().pipe(
      catchError((err) => {
        this.logError(err, request);
        return throwError(() => err);
      }),
    );
  }

  private log(req: any) {
    const body = { ...req.body };
    this.logger.log(
      {
        timestamp: new Date().toISOString(),
        from: req.ip,
        method: req.method,
        route: req.route.path,
        data: {
          body: body,
          query: req.query,
          params: req.params,
        },
      },
      LoggerInterceptor.name,
    );
  }

  private logError(err, req): void {
    const body = { ...req.body };
    const query = { ...req.query };

    // delete body.password;
    // delete query.password;

    const message = {
      from: req.ip,
      method: req.method,
      route: req.route.path,
      request: {
        body: body,
        query: query,
        params: req.params,
      },
      exception: err,
    };

    if (err.status >= 500) {
      this.logger.error({ message }, LoggerInterceptor.name);
    }

    if (err.status < 500) {
      this.logger.warn({ message }, LoggerInterceptor.name);
    }
  }
}
