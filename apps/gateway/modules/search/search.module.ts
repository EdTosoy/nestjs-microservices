import { Module } from '@nestjs/common';
import { RmqClientsModule } from 'apps/gateway/src/rmq/rmq.module';
import { SearchHTTPController } from './search.controller';

@Module({
  imports: [RmqClientsModule],
  controllers: [SearchHTTPController],
})
export class SearchGatewayModule {}
