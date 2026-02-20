import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtAuthGuard } from 'libs/common/guards/jwt-auth.guard';
import { PermissionGuard } from 'libs/common/guards/permission.guard';
import { RolesGuard } from 'libs/common/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ClientsModule.register(
      [
        {
          name: 'CATALOG_CLIENT',
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL ?? "amqp://localhost:5672"],
            queue: process.env.CATALOG_QUEUE ?? "catalog_queue",
            queueOptions: { durable: false }

          }
        },
        {
          name: 'MEDIA_CLIENT',
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL ?? "amqp://localhost:5672"],
            queue: process.env.MEDIA_QUEUE ?? "media_queue",
            queueOptions: { durable: false }

          }
        },
        {
          name: 'SEARCH_CLIENT',
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL ?? "amqp://localhost:5672"],
            queue: process.env.SEARCH_QUEUE ?? "search_queue",
            queueOptions: { durable: false }

          }
        },
        {
          name: 'AUTH_CLIENT',
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL ?? "amqp://localhost:5672"],
            queue: process.env.AUTH_QUEUE ?? "auth_queue",
            queueOptions: { durable: false }
          }
        },
      ]
    )
  ],
  controllers: [GatewayController],
  providers: [
    GatewayService,
    {
      provide: APP_GUARD,
      useFactory: (reflector: Reflector) => new JwtAuthGuard(reflector),
      inject: [Reflector]
    },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: PermissionGuard },
  ],
})
export class GatewayModule { }
