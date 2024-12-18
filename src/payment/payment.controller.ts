import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { InsertPaymentDTO } from './DTO/insertPayment.DTO';

@Controller('payment')
export class PaymentController {
    /**
     * PaymentController: Expõe as rotas para o gerenciamento de pagamentos.
     * @param paymentService - Injeção do serviço de pagamentos
     */
    constructor(private readonly paymentService: PaymentService) {}
    /**
     * @Post('buy/:clientId'): Rota para realizar a compra, usando insertPayment para criar um registro de pagamento.
     */
    @Post('buy/:clientId')
    @UseGuards(JwtAuthGuard)
    async buy(@Param('clientId') clientId: string, @Body() paymentDTO: InsertPaymentDTO){
        return await this.paymentService.insertPayment(clientId, paymentDTO)
    }
    @Get('history')
    @UseGuards(JwtAuthGuard)
    async getHistory(){
        return await this.paymentService.paymentHistory();
    }
    /**
     * @Get('history/:clientId'): Rota para visualizar o histórico de pagamentos de um cliente específico.
     */
    @Get('history/:clientId')
    @UseGuards(JwtAuthGuard)
    async getHistoryByClient(@Param('clientId') clientId: string) {
        return await this.paymentService.paymentHistoryByClient(clientId)
    }
}
