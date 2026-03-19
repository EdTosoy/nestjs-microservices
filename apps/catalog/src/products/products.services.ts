import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { rpcBadRequest } from 'libs/rpc/errors';
import { ProductStatus } from '@app/prisma/generated/enums';
import { isUUID } from 'class-validator';
import { CreateProductDto } from '@app/common/dto/createProduct.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(createProductInput: CreateProductDto) {
    const { description, name, price, status } = createProductInput;
    if (!name || !description) {
      rpcBadRequest('name and description are required');
    }
    if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
      rpcBadRequest('Price must be a valid number >= 0');
    }
    if (
      status &&
      ![ProductStatus.ACTIVE, ProductStatus.DRAFT].includes(status)
    ) {
      rpcBadRequest('Status must be either draft or active');
    }
    const newlyCreatedProduct = await this.prisma.product.create({
      data: { ...createProductInput },
    });
    return newlyCreatedProduct;
  }

  async listProducts() {
    return await this.prisma.product.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async getProductById(id: string) {
    if (!isUUID(id)) {
      rpcBadRequest('Invalid product ID');
    }
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    return product;
  }
}
