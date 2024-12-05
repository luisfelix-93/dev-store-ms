import {  Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { BucketService } from './bucket.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';

/**
 * Controlador responsável por gerenciar as operações relacionadas ao "Bucket" (carrinho de compras).
 * Todas as rotas deste controlador estão protegidas pelo `JwtAuthGuard`, o que requer autenticação JWT.
 */
@Controller('bucket')
export class BucketController {
    /**
     * Injeta o `BucketService` para acessar os métodos de manipulação do bucket.
     * @param {BucketService} bucketService - Serviço que contém a lógica de negócio para manipulação dos buckets.
     */
    constructor(private readonly bucketService: BucketService) {}

    /**
     * Adiciona um produto ao bucket de um cliente específico.
     * 
     * @param {string} clientId - ID do cliente.
     * @param {string} productId - ID do produto a ser adicionado ao bucket.
     * @returns {Promise<any>} Resultado da operação de adição de produto ao bucket.
     */

    @Get('client/:clientId/product/:productId')
    @UseGuards(JwtAuthGuard)
    async insertProductBucket(@Param('clientId') clientId: string, @Param('productId') productId: string){
        return await this.bucketService.addProduct(clientId, productId);
    }

    /**
     * Obtém a lista de produtos no bucket de um cliente específico.
     * 
     * @param {string} clientId - ID do cliente.
     * @returns {Promise<any>} Lista de produtos no bucket do cliente.
     */

    @Get('client/:clientId')
    @UseGuards(JwtAuthGuard)
    async getBucketList(@Param('clientId') clientId: string) {
        return await this.bucketService.getBucket(clientId);
    }

    /**
     * Limpa o bucket (carrinho) de um cliente específico, removendo todos os produtos.
     * 
     * @param {string} clientId - ID do cliente.
     * @returns {Promise<any>} Resultado da operação de limpeza do bucket.
     */
    
    @Delete('client/:clientId')
    @UseGuards(JwtAuthGuard)
    async clearBucketList(@Param('clientId') clientId: string) {
        return await this.bucketService.clearBucket(clientId);
    }

    // @Delete('client/:clientId/product/:productId')
    // @UseGuards(JwtAuthGuard)
    // async removeProductFromBucket(@Param('clientId') clientId: string, @Param('productId') productId: string){}
}
