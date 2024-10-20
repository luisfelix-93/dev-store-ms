import { Prop, Schema } from "@nestjs/mongoose";
import { Client } from "src/client/schemas/client.schema";
import { Product } from "src/product/schemas/product.schema";
@Schema()
export class Bucket {
    @Prop()
    client: Client;
    @Prop()
    productList: Product[];
    
    @Prop({ default: 0 })
    totalPrice: number;
}
