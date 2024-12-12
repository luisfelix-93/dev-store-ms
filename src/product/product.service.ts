import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

import axios from 'axios';
import { Cache } from 'cache-manager';
import { Product } from './schemas/product.schema';
import * as dotenv from 'dotenv'
dotenv.config();

/**
 * Serviço de produto responsável por buscar informações de um produto
 * com base em um `productId` e um `clientId`.
 */
@Injectable()
export class ProductService {
     /**
     * @param {Cache} cacheManager - O gerenciador de cache injetado para armazenar e recuperar tokens de autenticação.
     */
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager : Cache
    ) {}


    /**
     * Busca informações de um produto pelo seu ID, utilizando autenticação do cliente.
     *
     * @param {string} productId - O identificador único do produto a ser buscado.
     * @param {string} clientId - O identificador único do cliente, usado para recuperar o token de autenticação do cache.
     * @returns {Promise<Product | null>} - Retorna o objeto `Product` com os dados do produto caso seja encontrado, ou `null` se o token não for encontrado.
     */

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
