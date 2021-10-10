import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { WinstonConfiguration } from './config/winston.configuration';

async function bootstrap() {
  const logger = WinstonModule.createLogger(
    WinstonConfiguration.config(process.env.APP_NAME),
  );

  const server = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: process.env.RABBITMQ_QUEUE,
        noAck: false,
        queueOptions: {
          durable: true,
          logger: logger,
        },
      },
      logger: logger,
    },
  );

  await server.listen();

  logger.log(
    'microservice successfully started ' + process.env.APP_ENV,
    'Main',
  );
}
bootstrap();
