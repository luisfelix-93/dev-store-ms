import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { InsertPaymentDTO } from './DTO/insertPayment.DTO';
import { PaymentHistory } from './DTO/paymentHistory.DTO';

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
    /**
     * GET /payment/history-by-date/:clientId
     * @param clientId 
     * @param start_date 
     * @param end_date 
     * @param limit 
     * @param offset 
     * @returns {Promise<PaymentHistory[]>}
     */
    @Get('history-by-date/:clientId')
    @UseGuards(JwtAuthGuard)
    async getHistoryByDate(
        @Param('clientId') clientId: string,
        @Query('start_date') start_date: string,
        @Query('end_date') end_date: string,
        @Query('limit') limit: string,
        @Query('offset') offset: string
    ): Promise<PaymentHistory[]> {
        return await this.paymentService.paymentHistoryByDate(
            clientId, 
            new Date(start_date), 
            new Date (end_date), 
            parseInt(limit, 10), 
            parseInt(offset, 10)
        );
    }
}
