import { IsEmail, IsNotEmpty, IsOptional, IsInt, IsEnum, IsDateString } from "class-validator";

export class UpdateEmployeeDto {
    @IsNotEmpty({ message: 'id không được để trống' })
    id: number;

    @IsNotEmpty({ message: 'name không được để trống' })
    name: string;

    @IsOptional()
    code?: string;

    @IsOptional()
    @IsDateString({}, { message: 'Ngày sinh không hợp lệ' })
    birthDate?: Date;

    @IsOptional()
    @IsEnum(['Male', 'Female', 'Other'], { message: 'Giới tính phải là Male, Female hoặc Other' })
    gender: 'Male' | 'Female' | 'Other';

    @IsOptional()
    idCard?: string;

    @IsOptional()
    position?: string;

    @IsOptional()
    @IsDateString({}, { message: 'Ngày bắt đầu không hợp lệ' })
    startDate?: Date;

    @IsOptional()
    @IsInt({ message: 'ID người dùng phải là số nguyên' })
    user_id?: number;

    @IsNotEmpty({ message: 'phoneNumber không được để trống' })
    phoneNumber?: string;

    @IsOptional()
    @IsEmail({}, { message: 'Email không hợp lệ' })
    email: string;

    @IsOptional()
    facebook?: string;

    @IsOptional()
    address?: string;

    @IsOptional()
    notes?: string;

    @IsOptional()
    img?: string;

    @IsOptional()
    @IsEnum(['Working', 'Resigned'], { message: 'Trạng thái không hợp lệ' })
    status: 'Working' | 'Resigned';

    @IsOptional()
    hotel_id: number;
}