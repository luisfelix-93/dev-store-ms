import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BucketModule } from './bucket/bucket.module';
import { ClientModule } from './client/client.module';
import { ProductModule } from './product/product.module';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      ttl:100*1000,
      max:100,
      isGlobal: true
    }),
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
    MongooseModule.forRoot(process.env.MONGODB_URI),
    BucketModule, 
    ClientModule, 
    ProductModule, AuthModule
  ],

})
export class AppModule {}
