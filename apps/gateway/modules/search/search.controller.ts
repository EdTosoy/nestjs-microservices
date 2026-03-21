import { Public, SearchProductsDto } from '@app/common';
import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class SearchHTTPController {
  constructor(
    @Inject('SEARCH_CLIENT') private readonly searchClient: ClientProxy,
  ) {}

  @Get('search')
  @Public()
  async search(@Query('q') query: string, @Query('limit') limit?: string) {
    const limitNo =
      typeof limit === 'string' && limit.trim() ? Number(limit) : undefined;

    const result = await firstValueFrom<SearchProductsDto>(
      this.searchClient.send('search.query', { query, limit: limitNo }),
    );

    return {
      query,
      count: Array.isArray(result) ? result.length : 0,
      result,
    };
  }
}
