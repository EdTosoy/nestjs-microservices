import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ProductStatus } from '@app/prisma/generated/enums';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsOptional()
  status?: ProductStatus[];
}
