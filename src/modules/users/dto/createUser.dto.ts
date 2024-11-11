import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({ message: 'user_name không được để trống' })
    user_name: string;

    @IsNotEmpty({ message: 'password không được để trống' })
    password: string;

    @IsNotEmpty({ message: 'email không được để trống' })
    @IsEmail({}, { message: 'email không hợp lệ' })
    email: string;

    phone: string;

    @IsNotEmpty({ message: 'role_id không được để trống' })
    role_id: number;
}