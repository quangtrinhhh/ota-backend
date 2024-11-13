import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateHotelDto {
    @IsNotEmpty({ message: 'name không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'address không được để trống' })
    address: string;

    @IsNotEmpty({ message: 'phone không được để trống' })
    phone: string;

    @IsNotEmpty({ message: 'email không được để trống' })
    @IsEmail({}, { message: 'email không đúng định dạng' })
    email: string;
}