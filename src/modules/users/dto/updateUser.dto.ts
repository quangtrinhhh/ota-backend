import { IsEmail, IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class UpdateUserDto {
    @IsNotEmpty({ message: 'id không được để trống' })
    id: number

    @IsOptional()
    user_name: string;

    @IsOptional()
    @MinLength(6, { message: 'Mật khẩu chứa ít nhất 6 ký tự' })
    password: string;

    @IsOptional()
    @IsEmail({}, { message: 'email không hợp lệ' })
    email: string;

    @IsOptional()
    phone: string;

    @IsOptional()
    hotel_id: number;

    @IsNotEmpty({ message: 'role_id không được để trống' })
    role_id: number;
}