

import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Cache } from "cache-manager";

/**
 * @class JwtAuthGuard
 * @classdesc Guard responsável por proteger rotas ao verificar tokens JWT e armazená-los em cache para otimizar a verificação.
 * 
 * ### Funcionalidade:
 * 1. **Dependências**:
 *    - `JwtService`: Utilizado para verificar a assinatura e o payload do token JWT.
 *    - `Cache`: Armazena tokens validados para reduzir a sobrecarga de verificações repetidas.
 * 
 * 2. **Método `canActivate`**:
 *    - **Extração do Token**: Recupera o cabeçalho de autorização (Authorization) da requisição e extrai o token JWT.
 *    - **Verificação do Token**: Valida a assinatura do token e extrai o `clientId` do token decodificado.
 *    - **Cache do Token**: Armazena o token validado no cache, usando o `clientId` como chave e definindo uma expiração de 30 minutos.
 *    - **Resultado da Verificação**: Retorna `true` para permitir o acesso se o token for válido; retorna `false` caso ocorra um erro.
 * 
 * @implements {CanActivate}
 */

@Injectable()
export class JwtAuthGuard implements CanActivate {
    /**
     * Cria uma instância de JwtAuthGuard.
     * @param {JwtService} jwtService - Serviço para verificar o token JWT.
     * @param {Cache} cacheManager - Gerenciador de cache para armazenar tokens validados.
     */
    constructor(
        private readonly jwtService: JwtService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ){}
    async canActivate(context: ExecutionContext):Promise<boolean> {
        /**
     * Método `canActivate` que verifica se a requisição pode acessar a rota.
     * 
     * @async
     * @param {ExecutionContext} context - Contexto da execução da requisição.
     * @returns {Promise<boolean>} `true` se o token for válido e a requisição for autorizada, caso contrário `false`.
     */
        const request = context.switchToHttp().getRequest();
        const authHeader = request. headers['authorization'];

        if (!authHeader) {
            return false;
        }

        const token = authHeader.split(' ')[1];

        try {
            const decodedToken = this.jwtService.verify(token);
            const sessionId = decodedToken.sessionId;

            // Armazenar o token no cache, com TTL de 1/2 hora (1800 segundos)
            await this.cacheManager.set(`token:${sessionId}`, token, 1800 * 1000);
            console.log(`Token stored in cache for sessionId: ${sessionId}: ${token}`);

            request.sessionId = sessionId;

            // Se o token for válido, retornar true (permissão concedida)
            return true;

            return true;
        } catch (error) {
            console.log('Error trying to authorize the requisition', error);
            return false;
        }
    }
}