import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs'

@Controller()
export class GatewayController {
  constructor(
    @Inject('CATALOG_CLIENT') private readonly catalogClient: ClientProxy,
    @Inject('SEARCH_CLIENT') private readonly searchClient: ClientProxy,
    @Inject('MEDIA_CLIENT') private readonly mediaClient: ClientProxy,
  ) { }

  @Get('health')
  async health() {
    const ping = async (serviceName: string, client: ClientProxy) => {
      try {
        const result = await firstValueFrom(
          client.send('service.ping', { from: 'gateway' })
        )
        return {
          ok: true,
          service: serviceName,
          result
        }
      } catch (err) {
        return {
          ok: false,
          service: serviceName,
          error: err?.message ?? "unknown error"
        }

      }
    }
    const [catalog, search, media] = await Promise.all([
      ping('catalog', this.catalogClient),
      ping('search', this.searchClient),
      ping('media', this.mediaClient),
    ])

    const ok = [catalog, search, media].every((s) => s.ok)

    return {
      ok,
      gataway: {
        service: 'gateway',
        now: new Date().toISOString()

      },
      services: {
        catalog,
        search,
        media
      }
    }
  }
}
