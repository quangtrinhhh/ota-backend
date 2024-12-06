import { IsEmail, IsNotEmpty, IsOptional, IsInt, IsEnum, IsDateString, MaxLength, MinLength } from "class-validator";

export class UpdateCustomerDto {
    @IsOptional()
    @IsNotEmpty()
    id: number;

    @IsOptional()
    @IsNotEmpty({ message: 'name không được để trống' })
    @MaxLength(50, { message: 'name chứa tối đa 50 ký tự' })
    name?: string;

    @IsOptional()
    @MinLength(10, { message: 'Số điện thoại chứa ít nhất 10 ký tự' })
    @MaxLength(15, { message: 'Số điện thoại chứa nhiều nhất 15 ký tự' })
    phone?: string;

    @IsOptional()
    @IsEmail({}, { message: 'email không hợp lệ' })
    email?: string;

    @IsOptional()
    @IsEnum(['Male', 'Female', 'Other'], { message: 'gender phải là Male, Female hoặc Other' })
    gender?: 'Male' | 'Female' | 'Other';

    @IsOptional()
    @IsInt({ message: 'hotel_id phải là số nguyên' })
    hotel_id?: number;

    @IsOptional()
    @IsDateString({}, { message: 'birthday phải là định dạng ngày hợp lệ (YYYY-MM-DD)' })
    birthday?: string;
}
