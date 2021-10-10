import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProductDTO } from './create-product.dto';

@Injectable()
export class ProductService {
  constructor(@Inject('PRODUCT_SERVICE') private client: ClientProxy) {}

  create(createProduct: CreateProductDTO) {
    this.client.emit('create-product', createProduct);
  }
}
