import { Controller } from '@nestjs/common';
import { SearchService } from './search.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ProductCreatedEvent, SearchProductsDto } from '@app/common';

@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @EventPattern('product.created')
  async onProductCreated(@Payload() payload: ProductCreatedEvent) {
    await this.searchService.upsertFromCatalogEvent(payload);
  }

  @MessagePattern('search.query')
  async query(@Payload() payload: SearchProductsDto) {
    return this.searchService.search(payload.query, payload.limit);
  }

  @MessagePattern('service.ping')
  ping() {
    return this.searchService.ping();
  }
}
