import { Prop, Schema } from "@nestjs/mongoose";
/**
 * Define o esquema `Client`, representando a estrutura dos dados de um cliente.
 */
@Schema()
export class Client{
    /** Nome do cliente. */
    @Prop()
    client_name: string;
    @Prop()
    email: string;
    /** Código postal do cliente. */
    @Prop()
    zipCode: string;
}