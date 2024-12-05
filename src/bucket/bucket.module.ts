import { Module } from '@nestjs/common';
import { BucketService } from './bucket.service';
import { BucketController } from './bucket.controller';
import { ClientModule } from 'src/client/client.module';
import { ProductModule } from 'src/product/product.module';
/**
 * Módulo `BucketModule` responsável por agrupar a lógica e o controlador para operações no bucket (carrinho de compras).
 * Importa os módulos `ClientModule` e `ProductModule` para acessar dados dos clientes e produtos, permitindo interação com esses módulos no contexto do bucket.
 */
@Module({
  imports:[
    ClientModule,
    ProductModule
  ],
  providers: [BucketService],
  controllers: [BucketController]
})
export class BucketModule {}
