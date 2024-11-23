import { Type } from 'class-transformer';
import { IsInt, IsEnum, IsOptional } from 'class-validator';

export class CreateInvoiceDto {

    @Type(() => Number)
    @IsInt()
    total_amount: number;

    @Type(() => Number)
    @IsInt()
    discount_amount: number;

    @Type(() => Number)
    @IsInt()
    discount_percentage: number;

    @IsOptional()
    note_discount: string;

    @IsOptional()
    note: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    customer_id: number;

    @IsEnum(['Cash', 'Credit_card', 'Bank_transfer'])
    payment_method: 'Cash' | 'Credit_card' | 'Bank_transfer';

    @IsEnum(['Paid', 'Unpaid'])
    status: 'Paid' | 'Unpaid';

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    booking_id: number;

    @Type(() => Number)
    @IsInt()
    hotel_id: number;
}
