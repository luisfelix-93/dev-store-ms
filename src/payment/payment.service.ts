import { Inject, Injectable } from '@nestjs/common';
import { Payment } from './schema/payment.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Bucket } from 'src/bucket/schemas/bucket.schema';
import { Cache } from 'cache-manager';
import { InsertPaymentDTO } from './DTO/insertPayment.DTO';
import * as dotenv from 'dotenv';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
dotenv.config();

@Injectable()
export class PaymentService {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        @InjectModel(Payment.name) private paymentModel : Model<Payment>
    ){}


    async insertPayment(clientId: string, paymentDTO: InsertPaymentDTO): Promise<Payment|null> {
        const bucketList = await this.getBucketList(clientId);
        if(!bucketList) {
            return null;
        }

        const isPaymentValid = await this.paymentMock(paymentDTO);
        if(!isPaymentValid) {
            return null;
        }
        const dateTransaction = Date.now();
        const maskedCard = this.maskCreditCardNumber(paymentDTO.cardSerial);
        const newPayment = new this.paymentModel({
            clientId,
            productList: bucketList,
            paymentType : paymentDTO.paymentType,
            nmHolder : paymentDTO.nmHolder,
            cardSerial : maskedCard,
            ccv : "***",
            dateValid : paymentDTO.dateValid,
            dateTransaction
        })
        this.deleteBucketList(clientId);
        return await newPayment.save();
    }

    async paymentHistory(clientId):Promise<Payment[]|null> {
        return await this.paymentModel.find({clientId}).exec();
    }

    private async getBucketList(clientId: string) : Promise<Bucket|null> {
        const bucketKey = `bucket${clientId}`;
        const bucketList:Bucket = await this.cacheManager.get(bucketKey)
        if(!bucketList) {
            return null
        };

        return bucketList;
    }

    private async paymentMock(paymentDTO : InsertPaymentDTO):Promise<boolean> {
        const paymentData = JSON.stringify({paymentDTO});
        const config = {
            method: 'POST',
            url: process.env.URL_PAYMENT,
            headers: {
                'Content-Type': 'application/json',
            },
            body: paymentData
        };
        const response = await axios.request(config);
        if(!response.data.isValid) {
            return false
        }
        return true;
    }

    private maskCreditCardNumber(cardNumber : string):string {
        const maskedCard = cardNumber.slice(0,-4).replace(/\d/g, '*') + cardNumber.slice(-4);
        return maskedCard;
    }

    private async deleteBucketList(clientId: string):Promise<void>{
        const bucketKey = `bucket${clientId}`;
        return await this.cacheManager.del(bucketKey)
    }

}
