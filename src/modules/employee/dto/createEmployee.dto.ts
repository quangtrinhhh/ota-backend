import {
    IsNotEmpty,
    IsOptional,
    IsEnum,
    IsEmail,
    IsPhoneNumber,
    IsDateString,
    IsInt,
    IsEmpty,
} from "class-validator";

export class CreateEmployeeDto {
    @IsNotEmpty({ message: 'Tên không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'code không được để trống' })
    code?: string;

    @IsOptional()
    @IsDateString({}, { message: 'Ngày sinh không hợp lệ' })
    birthDate?: Date;

    @IsOptional()
    @IsEnum(['Male', 'Female', 'Other'], { message: 'Giới tính phải là Male, Female hoặc Other' })
    gender: 'Male' | 'Female' | 'Other';

    @IsOptional()
    @IsEmpty({ message: 'Số CMND/CCCD không được có giá trị' })
    idCard?: string;

    @IsOptional()
    @IsEmpty({ message: 'Vị trí công việc không được có giá trị' })
    position?: string;

    @IsOptional()
    @IsDateString({}, { message: 'Ngày bắt đầu không hợp lệ' })
    startDate?: Date;

    @IsOptional()
    @IsInt({ message: 'ID người dùng phải là số nguyên' })
    user_id?: number;

    @IsNotEmpty({ message: 'phoneNumber không được để trống' })
    @IsPhoneNumber(null, { message: 'Số điện thoại không hợp lệ' })
    phoneNumber?: string;

    @IsNotEmpty({ message: 'Email không được để trống' })
    @IsEmail({}, { message: 'Email không hợp lệ' })
    email: string;

    @IsOptional()
    @IsEmpty({ message: 'Facebook không được có giá trị' })
    facebook?: string;

    @IsOptional()
    @IsEmpty({ message: 'Địa chỉ không được có giá trị' })
    address?: string;

    @IsOptional()
    @IsEmpty({ message: 'Ghi chú không được có giá trị' })
    notes?: string;

    @IsOptional()
    @IsEmpty({ message: 'Ảnh không được có giá trị' })
    img?: string;

    @IsOptional()
    @IsEnum(['Working', 'Resigned'], { message: 'Trạng thái không hợp lệ' })
    status: 'Working' | 'Resigned';

    @IsNotEmpty({ message: 'ID khách sạn không được để trống' })
    @IsInt({ message: 'ID khách sạn phải là số nguyên' })
    hotel_id: number;
}
