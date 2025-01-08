import { Injectable } from '@nestjs/common';
import * as amqplib from 'amqplib';
import * as dotenv from 'dotenv';
dotenv.config();


@Injectable()
export class WebhookService {
    private readonly rabbitMQHost: string;
    private readonly rabbitMQQueue: string;

    constructor() {
        this.rabbitMQHost = process.env.RABBITMQ_HOST ||'amqp://localhost:5672';
        this.rabbitMQQueue = "buy-payment";
    }

    async sendPaymentNotification(email: string, clientIp: string, totalPrice: string): Promise<void> {
        try {
            const queue = this.rabbitMQHost;
            const connection = await amqplib.connect(this.rabbitMQHost);
            const channel = await connection.createChannel();

            await channel.assertQueue(queue, {durable: true});
            const message = JSON.stringify({
                email,
                clientIp,
                totalPrice
            });
            channel.sendToQueue(queue, Buffer.from(message), {persistent: true});
            console.log(`Message sent to ${queue}: ${message}`);

            await channel.close();
            await connection.close();
        } catch (error) {
            console.log('Error sending message to queue', error);
        }
    }
}
