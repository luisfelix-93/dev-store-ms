import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schema/payment.schema';
import { ClientModule } from 'src/client/client.module';
import { WebhookModule } from 'src/webhook/webhook.module';

/**
 * Módulo `PaymentModule` responsável por agrupar a lógica e o controlador para operações de pagamento.
 * Importa os módulos `Mongoose` para ter acesso ao banco de dados do serviço.
 */
@Module({
  imports:[
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema}]),
    
    ClientModule,
    WebhookModule
  ],
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule {}
