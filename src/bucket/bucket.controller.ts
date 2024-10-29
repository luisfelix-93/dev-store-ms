import {  Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { BucketService } from './bucket.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('bucket')
export class BucketController {
    constructor(private readonly bucketService: BucketService) {}

    @Get('client/:clientId/product/:productId')
    @UseGuards(JwtAuthGuard)
    async insertProductBucket(@Param('clientId') clientId: string, @Param('productId') productId: string){
        console.log(typeof(productId))
        return await this.bucketService.addProduct(clientId, productId);
    }


    @Get('client/:clientId')
    @UseGuards(JwtAuthGuard)
    async getBucketList(@Param(':clientId') clientId: string) {
        return await this.bucketService.getBucket(clientId);
    }

    @Delete('client/:clientId')
    @UseGuards(JwtAuthGuard)
    async clearBucketList(@Param('clientId') clientId: string) {
        return await this.bucketService.clearBucket(clientId);
    }
}
