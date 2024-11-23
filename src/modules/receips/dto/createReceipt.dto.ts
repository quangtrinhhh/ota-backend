import { IsEnum, IsNotEmpty } from "class-validator";

export class CreateReceiptDto {
    @IsNotEmpty({ message: 'code không được để trống' })
    code: string;

    @IsNotEmpty({ message: 'amount không được để trống' })
    amount: number;

    @IsEnum(['Cash', 'Credit_card', 'Bank_transfer'])
    @IsNotEmpty({ message: 'payment_method không được để trống' })
    payment_method: 'Cash' | 'Credit_card' | 'Bank_transfer';

    @IsNotEmpty({ message: 'note không được để trống' })
    note: string;

    @IsNotEmpty({ message: 'hotel_id không được để trống' })
    hotel_id?: number;

    @IsNotEmpty({ message: 'customer_name không được để trống' })
    customer_name?: string;

    @IsNotEmpty({ message: 'created_by không được để trống' })
    created_by?: string;

    @IsNotEmpty({ message: 'category không được để trống' })
    category?: 'Room_Payment' | 'Service' | 'Other';

    @IsNotEmpty({ message: 'invoice_id không được để trống' })
    invoice_id?: number;
}