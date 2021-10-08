import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { utilities, WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
/**
 * Service Winston Configs Loggers
 *
 * @class
 */
@Injectable()
export class WinstonService {
  constructor(private configService: ConfigService) {}

  get config(): WinstonModuleOptions {
    return {
      levels: winston.config.npm.levels,
      defaultMeta: { service: this.configService.get<string>('app.name') },
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
            utilities.format.nestLike(
              this.configService.get<string>('app.name'),
              {
                prettyPrint: true,
              },
            ),
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
