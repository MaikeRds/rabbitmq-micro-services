import { Logger, Module } from '@nestjs/common';
import configuration from './configuration';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationService } from './configuration.service';
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
    Logger,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
  exports: [ConfigurationService, Logger],
})
export class AppConfigModule {}
