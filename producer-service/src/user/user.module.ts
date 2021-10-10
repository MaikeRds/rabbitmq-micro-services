import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ConfigurationService } from 'src/config/configuration.service';
import { AppConfigModule } from '../config/config.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [AppConfigModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'USER_SERVICE',
      useFactory: (configService: ConfigurationService) => {
        const userOptions = configService.getRMQUserOptions();
        return ClientProxyFactory.create(userOptions);
      },
      inject: [ConfigurationService],
    },
  ],
})
export class UserModule {}
