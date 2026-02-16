import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { SearchModule } from "./search.module";



async function bootstrap() {
  process.title = "Search";

  const logger = new Logger('SearchBoostrap')

  const rmqUrl = process.env.RABBITMQ_URL ?? "amqp://localhost:5672"

  const queue = process.env.SEARCH_QUEUE ?? "search_queue"



  //create an microservices instace
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SearchModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rmqUrl],
        queue,
        queueOptions: {
          durable: false,
        }
      }
    }
  )

  app.enableShutdownHooks()
  await app.listen()

  logger.log(`Search RMQ listening on queue ${queue} via ${rmqUrl} `)

}
bootstrap()
