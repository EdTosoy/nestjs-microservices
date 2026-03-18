import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { RmqClientsModule } from 'apps/gateway/src/rmq/rmq.module';

@Module({
  imports: [RmqClientsModule],
  controllers: [HealthController],
})
export class HealthModule {}
