import { Bucket } from "src/bucket/schemas/bucket.schema";


export class PaymentHistory {
    transactionId: string;
    dateTransaction: Date;
    paymentType: string;
    productList: Bucket;
}