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

/**
 * Serviço responsável pelo gerenciamento de pagamentos.
 * Realiza a criação de registros de pagamento, validação de pagamento,
 * recuperação do histórico de pagamentos e manipulação de dados no cache.
 */
@Injectable()
export class PaymentService {
        /**
     * Construtor que injeta o gerenciador de cache e o model Payment do MongoDB
     * 
     * @param {Cache} cacheManager - Gerenciador de cache para armazenar e recuperar tokens de autenticação.
     * @param {Payment.name} paymentModel - Model utilizado para rec
     */
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        @InjectModel(Payment.name) private paymentModel : Model<Payment>
    ){}

    
    /**
     * Registra um novo pagamento para o cliente especificado.
     * 
     * @param {string} clientId - ID do cliente para o qual o pagamento será registrado.
     * @param {InsertPaymentDTO} paymentDTO - Dados do pagamento a serem inseridos.
     * @returns {Promise<Payment|null>} - Retorna o registro de pagamento criado ou `null` caso ocorra algum erro.
     */

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
    /**
     * Obtém todo o histórico de pagamentos da aplicação
     * @returns {Promise<Payment[]|null>} - Lista de registro de pagamentos ou `{null}` caso não haja registro
     */
    async paymentHistory(): Promise<Payment[]|null>  {
        return await this.paymentModel.find().exec();
    }
    /**
     * Obtém o histórico de pagamentos de um cliente específico.
     * 
     * @param {string} clientId - ID do cliente cujo histórico de pagamentos será recuperado.
     * @returns {Promise<Payment[]|null>} - Lista de registros de pagamentos ou `null` caso não haja registros.
     */
    async paymentHistoryByClient(clientId):Promise<Payment[]|null> {
        return await this.paymentModel.find({clientId}).exec();
    }
    /**
     * Recupera a lista de produtos no carrinho de um cliente armazenada no cache.
     * 
     * @param {string} clientId - ID do cliente cujo carrinho será recuperado.
     * @returns {Promise<Bucket|null>} - Retorna o carrinho (`Bucket`) ou `null` se não existir.
     */
    private async getBucketList(clientId: string) : Promise<Bucket|null> {
        const bucketKey = `bucket${clientId}`;
        const bucketList:Bucket = await this.cacheManager.get(bucketKey)
        if(!bucketList) {
            return null
        };

        return bucketList;
    }
    /**
     * Realiza uma simulação de validação de pagamento chamando uma API externa.
     * 
     * @param {InsertPaymentDTO} paymentDTO - Dados do pagamento a serem validados.
     * @returns {Promise<boolean>} - Retorna `true` se o pagamento for válido, caso contrário, `false`.
     * Caso a API de mock não seja encontrada, retorna `true`.
     */
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

        try {
            const response = await axios.request(config);
            if(!response.data.isValid) {
                return false
            }
            return true;
        } catch (error) {
            if(axios.isAxiosError(error) && error.response?.status === 404) {
                console.warn('mock de API não encontrado')
                return true;
            }
            console.error('Erro ao validar pagamento:', error.message);
            return false;
        }
        
    
    }
    /**
     * Aplica uma máscara ao número do cartão de crédito, ocultando todos os dígitos, exceto os últimos 4.
     * 
     * @param {string} cardNumber - Número completo do cartão de crédito.
     * @returns {string} - Número do cartão com máscara aplicada.
     */
    private maskCreditCardNumber(cardNumber : string):string {
        const maskedCard = cardNumber.slice(0,-4).replace(/\d/g, '*') + cardNumber.slice(-4);
        return maskedCard;
    }
    /**
     * Exclui o carrinho de produtos do cliente no cache após a conclusão de uma compra.
     * 
     * @param {string} clientId - ID do cliente cujo carrinho será excluído do cache.
     * @returns {Promise<void>} - Confirmação da exclusão do carrinho.
     */
    private async deleteBucketList(clientId: string):Promise<void>{
        const bucketKey = `bucket${clientId}`;
        return await this.cacheManager.del(bucketKey)
    }

}
