import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, Transport } from '@nestjs/microservices';
/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class ConfigurationService {
  constructor(private configService: ConfigService) {}

  get env(): string {
    return this.configService.get<string>('app.env');
  }

  get app(): string {
    return this.configService.get<string>('app.name');
  }

  get rabbitmqUrl(): string {
    return this.configService.get<string>('app.rabbitmq.url');
  }

  get rabbitmqQueue(): string {
    return this.configService.get<string>('app.rabbitmq.queue');
  }

  getRMQProductOptions(): {
    transport: Transport.RMQ;
  } & ClientOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.rabbitmqUrl],
        queue: 'products',
        noAck: false,
        queueOptions: {
          durable: true,
        },
      },
    };
  }

  getRMQUserOptions(): {
    transport: Transport.RMQ;
  } & ClientOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.rabbitmqUrl],
        queue: 'users',
        noAck: false,
        queueOptions: {
          durable: true,
        },
      },
    };
  }
}
