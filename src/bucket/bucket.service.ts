import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Bucket } from './schemas/bucket.schema';
import { ClientService } from 'src/client/client.service';
import { ProductService } from 'src/product/product.service';

/**
 * Serviço responsável por gerenciar o bucket (carrinho de compras) de um cliente.
 * Utiliza o cache para armazenar e recuperar os dados do bucket, além de interagir com serviços de clientes e produtos.
 */
@Injectable()
export class BucketService {
    /**
     * Injeta o gerenciador de cache, `ClientService`, e `ProductService` para gerenciar o bucket.
     * @param {Cache} cacheManager - Gerenciador de cache para armazenar temporariamente o bucket do cliente.
     * @param {ClientService} clientService - Serviço que lida com operações relacionadas ao cliente.
     * @param {ProductService} productService - Serviço que lida com operações relacionadas aos produtos.
     */
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private clientService: ClientService,
        private productService: ProductService
    ){}
    /**
     * Adiciona um produto ao bucket (carrinho de compras) de um cliente.
     * 
     * @param {string} clientId - ID do cliente.
     * @param {string} productId - ID do produto a ser adicionado.
     * @returns {Promise<Bucket>} O bucket atualizado contendo o novo produto e o preço total.
     */
    async addProduct(clientId: string, productId: string, sessionId: string):Promise<Bucket> {

        const bucketKey = `bucket${clientId}`;
        const client = await this.clientService.getClientById(clientId, sessionId);

        let bucket:Bucket = await this.cacheManager.get(bucketKey);

        if(!bucket) {
            bucket = new Bucket();
            bucket.client = client;
            bucket.productList = [];
            bucket.totalPrice = 0;
        };

        const product = await this.productService.findProductByQueueId(productId);

        bucket.productList.push(product);
        bucket.totalPrice += product.price;

        await this.cacheManager.set(bucketKey, bucket, 1800*1000);

        return bucket;
    }

     /**
     * Recupera o bucket do cliente a partir do cache.
     * 
     * @param {string} clientId - ID do cliente.
     * @returns {Promise<Bucket>} O bucket do cliente, se existir no cache.
     */

    async getBucket(clientId: string):Promise<Bucket> {
        const bucketKey = `bucket${clientId}`;
        
        return await this.cacheManager.get(bucketKey);
    }

    /**
     * Limpa o bucket do cliente, removendo-o do cache.
     * 
     * @param {string} clientId - ID do cliente.
     * @returns {Promise<void>} Retorna void ao deletar o bucket do cache.
     */
    async clearBucket(clientId: string) : Promise<void> {
        const bucketKey = `bucket${clientId}`;
        return await this.cacheManager.del(bucketKey)
    }
    /**
    * Remove um item do bucket de um cliente.
    * @param clientId O ID do cliente.
    * @param productId O ID do produto a ser removido.
    */
    async removeItemFromBucket(clientId: string, productId: string): Promise<Bucket> {
        const bucketKey = `bucket${clientId}`;
        const bucket: Bucket = await this.cacheManager.get<Bucket>(bucketKey);

        if (!bucket) {
            throw new Error('Bucket not found for the client');
        }

        const productIndex = bucket.productList.findIndex((product) => product.product_id === productId);

        if (productIndex === -1) {
            throw new Error('Product not found in the bucket');
        }

        const updatedProductList = [...bucket.productList];
        updatedProductList.splice(productIndex, 1);

        const updatedTotalPrice = updatedProductList.reduce((sum, product) => sum + product.price, 0);

        const updatedBucket: Bucket = {
            ...bucket,
            productList: updatedProductList,
            totalPrice: updatedTotalPrice,
        };

        await this.cacheManager.set(bucketKey, updatedBucket);

        return updatedBucket;
    }
}
