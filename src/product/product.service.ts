import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

import axios from 'axios';
import { Cache } from 'cache-manager';
import { Product } from './schemas/product.schema';
import * as dotenv from 'dotenv'
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
dotenv.config();

/**
 * Serviço de produto responsável por buscar informações de um produto
 * com base em um `productId` e um `clientId`.
 */
@Injectable()
export class ProductService {
    private client: ClientProxy
     /**
     * @param {Cache} cacheManager - O gerenciador de cache injetado para armazenar e recuperar tokens de autenticação.
     * @param {ClientProxy} client - O cliente injetado para realizar requisições ao serviço
     */
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager : Cache
    ) {
        this.client = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [process.env.RABBITMQ_URL],
                queue: 'product_queue',
                queueOptions: {
                    durable: false
                },
            },
        });
    }


    /**
     * Busca informações de um produto pelo seu ID, utilizando autenticação da sessão.
     *
     * A busca é feita pelo 
     * 
     * @param {string} productId - O identificador único do produto a ser buscado.
     * @param {string} sessionId - O identificador único da sessão, usado para recuperar o token de autenticação do cache.
     * @returns {Promise<Product | null>} - Retorna o objeto `Product` com os dados do produto caso seja encontrado, ou `null` se o token não for encontrado.
     */
    async findProductByQueueId(productId: string): Promise<Product|null> {

    console.log(`Buscando produto ${productId} usando RabbitMQ...`);

    try {
        const response = await this.client
            .send<{ price: number; title: string }>('find-product-by-id', {
                productId
            })
            .toPromise();

        if (!response) {
            console.error('Produto não encontrado!');
            return null;
        }

        const product = new Product();
        product.price = response.price;
        product.title = response.title;

        return product;
    } catch (error) {
        console.error('Erro ao buscar produto via RabbitMQ:', error.message);
        return null;
    }
}
    async findProductById(productId: string, sessionId: string):Promise<Product|null> {
        const token = await this.cacheManager.get(`token:${sessionId}`);
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
