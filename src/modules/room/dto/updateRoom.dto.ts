import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateRoomDto {
  @IsOptional() // Chỉ cần có trong request nếu cần cập nhật
  @MinLength(1, { message: 'Name phải nhập ít nhất 1 ký tự.' })
  name?: string;

  @IsOptional()
  @IsBoolean({ message: 'clean_status phải là kiểu boolean' })
  @Transform(({ value }) => {
    // Chuyển đổi từ string '1' -> true và '0' -> false
    if (value === '1') return true;
    if (value === '0') return false;
    return value; // Giữ nguyên giá trị boolean nếu đã đúng
  })
  clean_status?: boolean;

  @MinLength(1, { message: 'status phải nhập ít nhất 1 ký tự.' })
  @IsOptional() // Mặc định là "available" nếu không có trong request
  status?: string;

  @IsOptional()
  @Type(() => Number) // Chuyển từ chuỗi sang số nếu cần
  @IsInt({ message: 'Giá phải là số nguyên' })
  @Min(0, { message: 'Giá phải lớn hơn hoặc bằng 0' })
  price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'room_type_id phải là số nguyên' })
  room_type_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'hotel_id phải là số nguyên' })
  hotel_id?: number;
}
