import { Module } from '@nestjs/common';
import { ProductService } from './product.service';


/**
 * Módulo do produto responsável por configurar o serviço de produto
 */
@Module({
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
