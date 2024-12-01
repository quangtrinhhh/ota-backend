import { IsNotEmpty } from "class-validator";

export class RequestTransactionDto {
    @IsNotEmpty({ message: 'currencyType không được để trống' })
    currencyType: string;

    @IsNotEmpty({ message: 'hotel_id không được để trống' })
    hotel_id: number;

    @IsNotEmpty({ message: 'invoice_id không được để trống' })
    invoice_id: number;

    @IsNotEmpty({ message: 'note không được để trống' })
    note: string;

    @IsNotEmpty({ message: 'paymentMethod không được để trống' })
    paymentMethod: "Cash" | "Credit_card" | "Bank_transfer";

    @IsNotEmpty({ message: 'paymentOption không được để trống' })
    paymentOption: string;

    @IsNotEmpty({ message: 'price không được để trống' })
    price: number;

    @IsNotEmpty({ message: 'user_id không được để trống' })
    user_id: number
}