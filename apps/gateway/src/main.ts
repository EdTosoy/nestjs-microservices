import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module'; import { RpcToHttpExceptionFilter } from './filters/rpc-to-http.filter';
async function bootstrap() {
  process.title = 'gateway';

  const logger = new Logger('GatewayBootstrap');

  const app = await NestFactory.create(GatewayModule);

  app.useGlobalFilters(new RpcToHttpExceptionFilter())

  const port = Number(process.env.GATEWAY_PORT ?? 3000);

  try {
    await app.listen(port);
    logger.log(`Gateway running at port ${port}`);
  } catch (err) {
    logger.error('Failed to start the application', err as Error);
  }
}

bootstrap().catch((err) => {
  console.error('fatal bootstrap error', err);
  process.exit(1);
});
