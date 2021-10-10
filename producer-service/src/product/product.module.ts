import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { AppConfigModule } from 'src/config/config.module';
import { ConfigurationService } from '../config/configuration.service';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [AppConfigModule],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: 'PRODUCT_SERVICE',
      useFactory: (configService: ConfigurationService) => {
        const productOptions = configService.getRMQProductOptions();
        return ClientProxyFactory.create(productOptions);
      },
      inject: [ConfigurationService],
    },
  ],
})
export class ProductModule {}
