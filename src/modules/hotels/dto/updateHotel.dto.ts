import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateHotelDto {
    @IsNotEmpty({ message: 'id không được để trống' })
    id: number;

    @IsOptional()
    name: string;

    @IsOptional()
    address: string;

    @IsOptional()
    phone: string;

    @IsOptional()
    @IsEmail({}, { message: 'email không đúng định dạng' })
    email: string;
}