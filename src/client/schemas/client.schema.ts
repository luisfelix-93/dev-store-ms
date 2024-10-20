import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class Client{
    
    @Prop()
    client_name: string;
    @Prop()
    zipCode: string;
}