import {
  CreateProductDto,
  CurrentUser,
  Public,
  RoleEnum,
  Roles,
  type User,
} from '@app/common';
import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class ProductHttpController {
  constructor(
    @Inject('CATALOG_CLIENT') private readonly catalogClient: ClientProxy,
  ) {}

  @Post('products')
  @Roles(RoleEnum.ADMIN)
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

  @Get('products')
  @Public()
  async listProducts() {
    return firstValueFrom(this.catalogClient.send('product.list', {}));
  }

  @Get('product/:id')
  @Public()
  async getProductById(@Param('id') id: string) {
    return firstValueFrom(this.catalogClient.send('product.getById', id));
  }
}
