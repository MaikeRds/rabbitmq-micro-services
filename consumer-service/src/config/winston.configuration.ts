import { utilities, WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

export class WinstonConfiguration {
  static config(serviceName: string): WinstonModuleOptions {
    return {
      levels: winston.config.npm.levels,
      defaultMeta: { service: serviceName },
      format: winston.format.combine(
        winston.format.json(),
        winston.format.timestamp(),
        winston.format.printf((info: any) =>
          JSON.stringify(info).replace(/\\n/g, '\\n').replace(/\\t/g, '\\t'),
        ),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            utilities.format.nestLike(serviceName, {
              prettyPrint: true,
            }),
          ),
        }),
        new winston.transports.File({
          level: 'info',
          filename: 'application.log',
          dirname: 'logs',
        }),
        new winston.transports.File({
          level: 'error',
          filename: 'errors.log',
          dirname: 'logs',
        }),
      ],
    };
  }
}
