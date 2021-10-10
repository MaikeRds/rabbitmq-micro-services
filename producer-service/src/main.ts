import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WinstonModule } from 'nest-winston';
import { ConfigurationService } from './config/configuration.service';
import { WinstonService } from './config/winston.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const winstonService = app.get(WinstonService);

  const logger = WinstonModule.createLogger(winstonService.config);

  app.useLogger(logger);

  const configService = app.get(ConfigurationService);

  await app.listen(3000);

  logger.log('Starting in an environment of ' + configService.env, 'Main');

  // Initialized service of messages
  const server = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [configService.rabbitmqUrl],
        queue: configService.rabbitmqQueue,
        noAck: false,
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  await server.listen();

  logger.log(
    'Initialized service of messages in an environment of ' + configService.env,
    'Main',
  );
}
bootstrap();
