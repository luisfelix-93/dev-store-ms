import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { InsertPaymentDTO } from './DTO/insertPayment.DTO';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Post('buy/:clientId')
    @UseGuards(JwtAuthGuard)
    async buy(@Param('clientId') clientId: string, @Body() paymentDTO: InsertPaymentDTO){
        return await this.paymentService.insertPayment(clientId, paymentDTO)
    }

    @Get('history/:clientId')
    @UseGuards(JwtAuthGuard)
    async getHistory(@Param('clientId') clientId: string) {
        return await this.paymentService.paymentHistory(clientId)
    }
}
