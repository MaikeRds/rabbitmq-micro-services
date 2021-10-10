import { Body, Controller, Post } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateProductDTO } from './create-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  create(@Body() createProduct: CreateProductDTO): string {
    this.productService.create(createProduct);
    return 'Product created';
  }

  /**
   *
   * { "pattern": "create-product", "data": { "codigo": "6010", "nome": "Bic de Sódio" } }
   *
   * @param data
   * @param context
   */
  // @UseInterceptors(new Logging2Interceptor())
  @MessagePattern('create-product')
  getProduct(
    @Payload() data: CreateProductDTO,
    @Ctx() context: RmqContext,
  ): void {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    // Confirm manual
    channel.ack(originalMsg);
  }
}
