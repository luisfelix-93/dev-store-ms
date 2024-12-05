import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './auth.guard';
/**
 * Módulo de autenticação que configura o JwtModule e registra o JwtAuthGuard.
 * O JwtModule é configurado para ser global, com uma chave secreta para assinatura de tokens e um tempo de expiração de 1 hora.
 * 
 * @module AuthModule
 */
@Module({
    imports: [
        /**
         * Importa e configura o JwtModule, que fornece suporte para geração e verificação de tokens JWT.
         * 
         * @property {boolean} global - Define o módulo como global, tornando-o acessível em toda a aplicação sem a necessidade de reimportação.
         * @property {string} secret - Define uma chave secreta para assinatura de tokens. **Importante:** Recomenda-se usar uma variável de ambiente para este valor em produção.
         * @property {Object} signOptions - Configura opções adicionais de assinatura para os tokens JWT.
         * @property {string} signOptions.expiresIn - Define o tempo de expiração dos tokens gerados, aqui configurado para 1 hora.
         */
        JwtModule.register({
            global: true,
            secret: 'XXXX',
            signOptions: { expiresIn: '1h' },
        })
    ],
    providers: [
        /**
         * Provedor que registra o JwtAuthGuard para ser usado na aplicação.
         * O JwtAuthGuard atua como um guard de autenticação, protegendo rotas que exigem um token JWT válido.
         */
        JwtAuthGuard
    ]
})
export class AuthModule {}
