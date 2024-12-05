import { Prop, Schema } from "@nestjs/mongoose";
import { Client } from "src/client/schemas/client.schema";
import { Product } from "src/product/schemas/product.schema";

/**
 * Define o schema para o documento `Bucket` no Cache, que representa um "carrinho de compras" ou "bucket" de produtos de um cliente específico.
 */

@Schema()
export class Bucket {
    /**
     * O cliente associado ao bucket.
     * @type {Client}
     */
    @Prop()
    client: Client;
    /**
     * Lista de produtos que o cliente adicionou ao bucket.
     * @type {Product[]}
     */
    @Prop()
    productList: Product[];
     /**
     * O preço total dos produtos no bucket. 
     * Inicializa com 0 por padrão.
     * @type {number}
     */
    @Prop({ default: 0 })
    totalPrice: number;
}
