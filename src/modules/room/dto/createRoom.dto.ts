import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  Min,
  IsOptional,
  IsNumberString,
} from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty({ message: 'Tên phòng không được bỏ trống' })
  name: string;

  @IsOptional()
  @IsBoolean({ message: 'clean_status phải là kiểu boolean' })
  clean_status?: boolean = true; // Mặc định là true

  @IsOptional()
  status?: string = 'available'; // Mặc định là "sạch"

  @IsNotEmpty({ message: 'Giá không được bỏ trống' })
  @Type(() => Number) // Chuyển đổi từ chuỗi thành số
  @IsInt({ message: 'Giá phải là số nguyên' })
  @Min(0, { message: 'Giá phải lớn hơn hoặc bằng 0' })
  price: number;

  @IsNotEmpty({ message: 'room_type_id không được bỏ trống' })
  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: 'room_type_id phải là số nguyên' })
  room_type_id: number;

  @IsNotEmpty({ message: 'hotel_id không được bỏ trống' })
  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: 'hotel_id phải là số nguyên' })
  hotel_id: number;
}
