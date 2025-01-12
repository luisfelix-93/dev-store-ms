import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Client } from './schemas/client.schema';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Serviço que gerencia operações relacionadas ao cliente, incluindo a obtenção de informações
 * de cliente por meio de uma requisição HTTP a uma API externa.
 */
@Injectable()
export class ClientService {

    /**
     * Construtor que injeta o gerenciador de cache.
     * 
     * @param {Cache} cacheManager - Gerenciador de cache para armazenar e recuperar tokens de autenticação.
     */

    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager : Cache
    ){}

    /**
     * Obtém um cliente por ID, recuperando o token do cache e fazendo uma requisição à API externa.
     * 
     * @param {string} clientId - ID do cliente.
     * @returns {Promise<Client>} O cliente com os dados recuperados ou `null` se o token não for encontrado.
     */
    async getClientById(clientId: string, sessionId: string):Promise<Client> {
        const token = await this.cacheManager.get(`token:${sessionId}`);

        if(!token) {
            console.log('token not found');
            return null;
        }

        const config = {
            method: 'GET', 
            url: `${process.env.CLIENT_URL}/${clientId}`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            timeOut: 10000
        };

        try {
            const client = new Client();
            const response = await axios.request(config);
            client.client_name = response.data.clientName;
            client.email = response.data.email;
            client.zipCode = response.data.zipCode;

            return client;
        } catch (error) {
            throw new Error(`Error fetching client: ${error.message}`);
        }
    }
}
