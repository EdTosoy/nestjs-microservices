import { CreateProductDto, CurrentUser, type User } from '@app/common';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class ProductHttpController {
  constructor(
    @Inject('CATALOG_CLIENT') private readonly catalogClient: ClientProxy,
  ) {}

  @Post('products')
  async createProduct(
    @CurrentUser() user: User,
    @Body() body: CreateProductDto,
  ) {
    return firstValueFrom(
      this.catalogClient.send('product.create', {
        ...body,
        createdByUserId: user.sub,
      }),
    );
  }
}
