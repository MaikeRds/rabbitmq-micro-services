import {
  Injectable,
  Inject,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
  LoggerService,
  Logger,
} from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextType = context.getType();
    if (contextType == 'http') {
      const request = context.switchToHttp().getRequest();
      this.log(request, contextType);
      return next.handle().pipe(
        catchError((err) => {
          this.logError(err, request, contextType);
          return throwError(() => err);
        }),
      );
    }

    if (contextType == 'rpc') {
      const data = context.switchToRpc().getData();
      const rqm: RmqContext = context.switchToRpc().getContext();
      const pattern = rqm.getPattern();
      const payload = { pattern: pattern, data: data };
      return next
        .handle()
        .pipe(tap(() => this.logger.log({ payload }, contextType)));
    }

    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.warn(
            'Protocol not identification ',
            LoggerInterceptor.name,
          ),
        ),
      );
  }

  private log(req: any, contextType: string) {
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
      contextType,
    );
  }

  private logError(err: any, req: any, contextType: string): void {
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
      this.logger.error({ message }, contextType);
    }

    if (err.status < 500) {
      this.logger.warn({ message }, contextType);
    }
  }
}
