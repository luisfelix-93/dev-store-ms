import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import axios from 'axios';
import { Cache } from 'cache-manager';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductService {
    
    constructor(
        @Inject('PRODUCT_SERVICE') private readonly client: ClientProxy,
        @Inject(CACHE_MANAGER) private cacheManager : Cache
    ) {}

    async findProductById(productId: string, clientId: string): Promise<Product> {
        const token = await this.cacheManager.get(`token: ${clientId}`);
        if(!token) {
            console.log('token not found')
        }
        return new Promise((resolve, reject) => {
            this.client.send({ cmd: 'find-product'}, productId).subscribe({
                next: async() => {
                    try {
                        const response = await axios.get(`http://192.168.100.4:3000/product/${productId}`, {
                            headers: {
                                'Authorization' : `Bearer ${token}`
                            },
                        });
                        resolve(response.data);
                    } catch (error) {
                        reject(error)
                    }

                },
                error: (err) => reject(err)
            })
        })
    }
}
