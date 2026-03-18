import { Module } from '@nestjs/common';
import { AuthGatewayController } from './auth.controller';
import { RmqClientsModule } from 'apps/gateway/src/rmq/rmq.module';

@Module({
  imports: [RmqClientsModule],
  controllers: [AuthGatewayController],
})
export class AuthGatewayModule {}
