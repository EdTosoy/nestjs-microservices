import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { MediaModule } from "./media.module";



async function bootstrap() {
  process.title = "Media";

  const logger = new Logger('MediaBoostrap')

  const rmqUrl = process.env.RABBITMQ_URL ?? "amqp://localhost:5672"

  const queue = process.env.MEDIA_QUEUE ?? "media_queue"

  //create an microservices instace
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MediaModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rmqUrl],
        queue,
        queueOptions: {
          durable: false
        }
      }
    }
  )

  app.enableShutdownHooks()
  await app.listen()

  logger.log(`Media RMQ listening on queue ${queue} via ${rmqUrl} `)


}
bootstrap()
