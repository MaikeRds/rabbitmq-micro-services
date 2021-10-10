import { Module } from '@nestjs/common';

import { AppConfigModule } from './config/config.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AppConfigModule, ProductModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
