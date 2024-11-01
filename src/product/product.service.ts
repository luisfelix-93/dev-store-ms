import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

import axios from 'axios';
import { Cache } from 'cache-manager';
import { Product } from './schemas/product.schema';
import * as dotenv from 'dotenv'
dotenv.config();

@Injectable()
export class ProductService {
    
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager : Cache
    ) {}



    async findProductById(productId: string, clientId: string):Promise<Product|null> {
        const token = await this.cacheManager.get(`token:${clientId}`);
        if(!token) {
            console.log('Token not found!');
            return null
        }
        console.log(typeof(productId))
        const config = {
            method: 'GET',
            url: `${process.env.PRODUCT_URL}/${productId}`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        } 
        const product = new Product();
        const response = await axios.request(config);

        product.price = response.data.price;
        product.title = response.data.title;

        return product;

    }
}
