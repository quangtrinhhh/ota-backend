import { IsEmail, IsNotEmpty, IsEnum, IsDateString, IsInt } from "class-validator";

export class CreateCustomerDto {
    @IsDateString()
    birthday: Date;

    phone: string;

    @IsNotEmpty({ message: 'email không được để trống' })
    @IsEmail({}, { message: 'email không hợp lệ' })
    email: string;

    @IsEnum(['Male' , 'Female' , 'Other'])
    gender: 'Male' | 'Female' | 'Other';

    @IsInt()
    hotel_id: number;
}