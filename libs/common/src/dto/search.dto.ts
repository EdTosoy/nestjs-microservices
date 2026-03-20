import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class SearchProductsDto {
  @IsString()
  query: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}
