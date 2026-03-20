import { Controller } from '@nestjs/common';
import { MediaService } from './media.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UploadProductImageDto } from '@app/common/dto/upload-product-image.dto';
import { AttachToProductDto } from '@app/common/dto/attach-to-product.dto';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @MessagePattern('service.ping')
  ping() {
    return this.mediaService.ping();
  }

  @MessagePattern('media.uploadProductImage')
  uploadProductImage(@Payload() payload: UploadProductImageDto) {
    return this.mediaService.uploadProductImage(payload);
  }

  @MessagePattern('media.attachToProduct')
  attachToProduct(@Payload() payload: AttachToProductDto) {
    return this.mediaService.attachToProduct(payload);
  }
}
