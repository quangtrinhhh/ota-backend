import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateUserDto {
    @IsNotEmpty({ message: 'id không được để trống' })
    id: number

    @IsOptional()
    user_name: string;

    @IsOptional()
    password: string;

    @IsOptional()

    email: string;

    @IsOptional()
    phone: string;

    @IsOptional()
    role_id: number;
}