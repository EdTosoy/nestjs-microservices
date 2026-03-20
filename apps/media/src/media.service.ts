import { Injectable } from '@nestjs/common';
import { initCloudinary } from './cloudinary/cloudinary.client';
import { PrismaService } from 'libs/prisma';
import { UploadProductImageDto } from '@app/common/dto/upload-product-image.dto';
import { rpcBadRequest } from 'libs/rpc/errors';
import { UploadApiResponse } from 'cloudinary';
import { UploadMediaResponse } from '@app/common';
import { AttachToProductDto } from '@app/common/dto/attach-to-product.dto';

@Injectable()
export class MediaService {
  private readonly cloudinary = initCloudinary();

  constructor(private readonly prisma: PrismaService) {}

  ping() {
    return {
      ok: true,
      service: 'media',
      now: new Date().toISOString(),
    };
  }

  async uploadProductImage(
    input: UploadProductImageDto,
  ): Promise<UploadMediaResponse> {
    const { base64, mimeType, uploadByUserId } = input;

    if (!base64) {
      rpcBadRequest('Image base64 is needed');
    }

    if (!mimeType.startsWith('image/')) {
      rpcBadRequest('Only Images are allowed');
    }

    const buffer = Buffer.from(input.base64, 'base64');

    if (!buffer.length) {
      rpcBadRequest('Invalid image data');
    }

    const uploadResult = await new Promise<UploadApiResponse | undefined>(
      (resolve, reject) => {
        const stream = this.cloudinary.uploader.upload_stream(
          {
            folder: 'nestjs-microservices/products',
            resource_type: 'image',
          },
          (err, result) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(result);
          },
        );

        stream.end(buffer);
      },
    );
    const url = uploadResult?.secure_url || uploadResult?.url;
    const publicId = uploadResult?.public_id;

    if (!url || !publicId) {
      rpcBadRequest('Cloudinary upload did not return proper response');
    }

    const mediaDoc = await this.prisma.media.create({
      data: {
        url,
        publicId,
        uploadByUserId,
        productId: undefined,
      },
    });

    return {
      mediaId: mediaDoc.id,
      url,
      publicId,
    };
  }

  async attachToProduct(
    input: AttachToProductDto,
  ): Promise<UploadMediaResponse> {
    const { mediaId, productId } = input;

    const updatedMedia = await this.prisma.media.update({
      where: {
        id: mediaId,
      },
      data: {
        productId: productId,
      },
    });

    return {
      mediaId: updatedMedia.id,
      publicId: updatedMedia.publicId,
      url: updatedMedia.url,
      productId: updatedMedia.productId,
    };
  }
}
