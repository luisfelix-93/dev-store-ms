import { Prop, Schema } from "@nestjs/mongoose";

/**
 * Representa o esquema do produto no banco de dados.
 */
@Schema()
export class Product {
    /**
     * Identificador do produto.
     * @type {string}
     */
    @Prop()
    product_id: string
    /**
     * O título do produto.
     * @type {string}
     */
    @Prop()
    title: string
    /**
     * O preço do produto.
     * @type {number}
     */
    @Prop()
    price: number
}