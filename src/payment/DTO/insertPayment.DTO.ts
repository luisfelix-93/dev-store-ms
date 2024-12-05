import { IsString, Length } from "class-validator";
/**
 * Data Transfer Object (DTO) para inserir informações de pagamento.
 */
export class InsertPaymentDTO {
    @IsString()
    paymentType: string;
    @IsString()
    nmHolder: string;
    @IsString()
    @Length(16)
    cardSerial: string;
    @IsString()
    ccv: string;
    @IsString()
    dateValid: string

}