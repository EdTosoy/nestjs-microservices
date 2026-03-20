import { ProductStatus } from '@app/prisma/generated/enums';

export class ProductCreatedEvent {
  id: string;
  name: string;
  description: string;
  price: number;
  status: ProductStatus;
  imageUrl?: string | null;
  createdByUserId: string;
  createdAt: Date;
  updatedAt: Date;
}
