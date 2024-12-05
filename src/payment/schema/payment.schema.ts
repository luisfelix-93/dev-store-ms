import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Bucket } from "src/bucket/schemas/bucket.schema";
/**
 * Define o schema para o documento `Payment` no MongoDB, que representa as informações de pagamento de uma compra específica.
 */
export type PaymentDocument = Payment & Document;
@Schema()
export class Payment {
    @Prop({required: true})
    clientId: string;
    @Prop({required: true})
    productList: Bucket;
    @Prop({required: true, enum: ['credit', 'debit']})
    paymentType: string;
    @Prop({required: true})
    nmHolder: string;
    @Prop({required: true})
    cardSerial: string;
    @Prop({required: true})
    ccv: string;
    @Prop({required: true})
    dateValid: string
    @Prop({required: true})
    dateTransaction: Date
}

export const PaymentSchema = SchemaFactory.createForClass(Payment)
