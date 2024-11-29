import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateInvoiceItemsDto {
    @IsOptional()
    id: number; //id service

    @IsOptional()
    name: string;

    @IsNotEmpty({ message: 'quantity không được để trống' })
    quantity: number;

    @IsNotEmpty({ message: 'unit_price không được để trống' })
    unit_price: number;
}
