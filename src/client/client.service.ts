import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Client } from './schemas/client.schema';
import axios from 'axios';

@Injectable()
export class ClientService {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager : Cache
    ){}

    async getClientById(clientId: string):Promise<Client> {
        const token = await this.cacheManager.get(`token:${clientId}`);

        if(!token) {
            console.log('token not found');
            return null;
        }

        const config = {
            method: 'GET', 
            url: `http://localhost:5050/client/${clientId}`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            timeOut: 10000
        };

        try {
            const client = new Client();
            const response = await axios.request(config);
            client.client_name = response.data.clientName;
            client.zipCode = response.data.zipCode;

            return client;
        } catch (error) {
            throw new Error(`Error fetching client: ${error.message}`);
        }
    }
}
