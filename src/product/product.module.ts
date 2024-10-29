import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports:[
    ClientsModule.register([
      {
        name:'PRODUCT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'product_queue',
          queueOptions: {
              durable: false
          }
        }
      }
    ]),
  ],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
