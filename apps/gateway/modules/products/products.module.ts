import { ProductHttpController } from './products.controller';
import { Module } from '@nestjs/common';
import { RmqClientsModule } from 'apps/gateway/src/rmq/rmq.module';

@Module({
  imports: [RmqClientsModule],
  controllers: [ProductHttpController],
})
export class ProductGatewayModule {}
