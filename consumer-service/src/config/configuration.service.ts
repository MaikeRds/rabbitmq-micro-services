import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
}
