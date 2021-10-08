import { Logger, Module } from '@nestjs/common';
import configuration from './configuration';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationService } from './configuration.service';
import { WinstonService } from './winston.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './interceptors/logger.interceptor';

/**
 * Import and provide app configuration related classes.
 *
 * @module
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [
    ConfigurationService,
    WinstonService,
    Logger,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
  exports: [ConfigurationService, WinstonService],
})
export class AppConfigModule {}
