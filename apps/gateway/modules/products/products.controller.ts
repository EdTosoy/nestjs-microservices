import {
  CreateProductDto,
  CurrentUser,
  ProductCreatedEvent,
  Public,
  RoleEnum,
  Roles,
  UploadMediaResponse,
  type User,
} from '@app/common';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { firstValueFrom } from 'rxjs';

@Controller()
export class ProductHttpController {
  constructor(
    @Inject('CATALOG_CLIENT') private readonly catalogClient: ClientProxy,
    @Inject('MEDIA_CLIENT') private readonly mediaClient: ClientProxy,
  ) {}

  @Post('products')
  @Roles(RoleEnum.ADMIN)
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async createProduct(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() body: CreateProductDto,
  ) {
    let imageUrl: string | undefined = undefined;
    let mediaId: string | undefined = undefined;

    if (file) {
      const base64 = file.buffer.toString('base64');

      const uploadResult = await firstValueFrom<UploadMediaResponse>(
        this.mediaClient.send('media.uploadProductImage', {
          fileName: file.originalname,
          mimeType: file.mimetype,
          base64,
          uploadByUserId: user.sub,
        }),
      );
      imageUrl = uploadResult.url;
      mediaId = uploadResult.mediaId;
    }

    const product = await firstValueFrom<ProductCreatedEvent>(
      this.catalogClient.send('product.create', {
        ...body,
        imageUrl,
        createdByUserId: user.sub,
      }),
    );

    if (mediaId && product) {
      await firstValueFrom<UploadMediaResponse>(
        this.mediaClient.send('media.attachToProduct', {
          mediaId,
          productId: product.id,
          attachByUserId: user.sub,
        }),
      );
    }

    return product;
  }

  @Get('products')
  @Public()
  async listProducts() {
    return firstValueFrom(this.catalogClient.send('product.list', {}));
  }

  @Get('products/:id')
  @Public()
  async getProductById(@Param('id') id: string) {
    return firstValueFrom(this.catalogClient.send('product.getById', id));
  }
}
