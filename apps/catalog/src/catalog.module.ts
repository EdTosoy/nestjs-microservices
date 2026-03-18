import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { ConfigModule } from '@nestjs/config';
import { ProductController } from './products/products.controller';
import { ProductService } from './products/products.services';
import { PrismaModule } from 'libs/prisma';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [CatalogController, ProductController],
  providers: [CatalogService, ProductService],
})
export class CatalogModule {}
