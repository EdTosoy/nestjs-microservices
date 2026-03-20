import { ProductCreatedEvent } from '@app/common';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'libs/prisma';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}
  ping() {
    return {
      ok: true,
      service: 'search',
      now: new Date().toISOString(),
    };
  }

  normalizeText(input: { name: string; description: string }) {
    return `${input.name} ${input.description}`.toLowerCase();
  }

  async upsertFromCatalogEvent(input: ProductCreatedEvent) {
    const { name, id, description, status, price, imageUrl } = input;
    const normalizedText = this.normalizeText({
      name: input.name,
      description: input.description,
    });
    await this.prisma.search.upsert({
      where: { productId: input.id },
      create: {
        productId: id,
        name,
        description,
        normalizedText,
        status,
        price,
        imageUrl,
      },
      update: {
        name,
        description,
        normalizedText,
        status,
        price,
        imageUrl,
      },
    });
  }

  async search(query: string, limit: number = 20) {
    return this.prisma.search.findMany({
      where: {
        normalizedText: {
          contains: query.toLowerCase(),
          mode: 'insensitive',
        },
      },
      take: limit,
    });
  }
}
