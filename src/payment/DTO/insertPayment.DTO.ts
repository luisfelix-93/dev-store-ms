import { IsString, Length } from "class-validator";

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