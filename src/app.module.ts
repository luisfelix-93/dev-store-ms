import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BucketModule } from './bucket/bucket.module';
import { ClientModule } from './client/client.module';
import { ProductModule } from './product/product.module';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      ttl:100*1000,
      max:100,
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    BucketModule, 
    ClientModule, 
    ProductModule, AuthModule, PaymentModule
  ],

})
export class AppModule {}
