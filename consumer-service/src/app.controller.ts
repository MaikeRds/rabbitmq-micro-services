import { Controller, Inject, Logger, LoggerService } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  /**
   * Consumer queues
   *
   * { "pattern": "create-user", "data": { "nome": "Maike Rodrigues" } }
   *
   * @param data
   * @param context
   */
  @MessagePattern('create-user')
  createUser(@Payload() data: any, @Ctx() context: RmqContext): void {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.logger.log({ data }, AppController.name);

    // Confirm manual
    channel.ack(originalMsg);
  }

  /**
   * Consumer queues
   *
   * { "pattern": "create-user-test", "data": { "nome": "Maike Rodrigues" } }
   *
   * @param data
   * @param context
   */
  @MessagePattern('create-user-test')
  createUserTest(@Payload() data: any, @Ctx() context: RmqContext): void {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    console.log(data);

    // Confirm manual
    channel.ack(originalMsg);
  }
}
