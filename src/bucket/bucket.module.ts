import { Module } from '@nestjs/common';
import { BucketService } from './bucket.service';
import { BucketController } from './bucket.controller';
import { ClientModule } from 'src/client/client.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports:[
    ClientModule,
    ProductModule
  ],
  providers: [BucketService],
  controllers: [BucketController]
})
export class BucketModule {}
