import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Bucket } from './schemas/bucket.schema';
import { ClientService } from 'src/client/client.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class BucketService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private clientService: ClientService,
        private productService: ProductService
    ){}

    async addProduct(clientId: string, productId: string):Promise<Bucket> {

        const bucketKey = `bucket${clientId}`;
        const client = await this.clientService.getClientById(clientId);

        let bucket:Bucket = await this.cacheManager.get(bucketKey);

        if(!bucket) {
            bucket = new Bucket();
            bucket.client = client;
            bucket.productList = [];
            bucket.totalPrice = 0;
        };

        const product = await this.productService.findProductById(productId, clientId);

        bucket.productList.push(product);
        bucket.totalPrice += product.price;

        await this.cacheManager.set(bucketKey, bucket, 1800*1000);

        return bucket;
    }

    async getBucket(clientId: string):Promise<Bucket> {
        const bucketKey = `bucket${clientId}`;
        
        return await this.cacheManager.get(bucketKey);
    }

    async clearBucket(clientId: string) : Promise<void> {
        const bucketKey = `bucket${clientId}`;
        return await this.cacheManager.del(bucketKey)
    }
}
