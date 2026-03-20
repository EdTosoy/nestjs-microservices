import { Controller } from '@nestjs/common';
import { ProductService } from './products.services';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateProductPayload } from '@app/common';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern('product.create')
  create(@Payload() payload: CreateProductPayload) {
    return this.productService.createProduct(payload);
  }

  @MessagePattern('product.list')
  list() {
    return this.productService.listProducts();
  }

  @MessagePattern('product.getById')
  getById(@Payload() id: string) {
    return this.productService.getProductById(id);
  }
}
