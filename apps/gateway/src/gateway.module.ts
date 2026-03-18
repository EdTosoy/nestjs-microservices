import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';
import { PermissionGuard } from '@app/common/guards/permission.guard';
import { RolesGuard } from '@app/common/guards/roles.guard';
import { HealthModule } from '../modules/health/health.module';
import { ProductGatewayModule } from '../modules/products/products.module';
import { AuthGatewayModule } from '../modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthGatewayModule,
    HealthModule,
    ProductGatewayModule,
  ],
  providers: [
    GatewayService,
    {
      provide: APP_GUARD,
      useFactory: (reflector: Reflector) => new JwtAuthGuard(reflector),
      inject: [Reflector],
    },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: PermissionGuard },
  ],
})
export class GatewayModule {}
