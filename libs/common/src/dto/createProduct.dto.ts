import {
  IsString,
  IsNumber,
  IsOptional,
  IsUrl,
  IsEnum,
  Min,
} from 'class-validator';
import { ProductStatus } from '@app/prisma/generated/enums';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
