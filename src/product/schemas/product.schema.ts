import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class Product {
    @Prop()
    title: string
    @Prop()
    price: number
}