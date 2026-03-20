import { IsOptional, IsString } from 'class-validator';

export class AttachToProductDto {
  @IsString()
  mediaId: string;

  @IsString()
  productId: string;

  @IsString()
  @IsOptional()
  attachByUserId?: string;
}
