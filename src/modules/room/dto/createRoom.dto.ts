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
  @Type(() => Number) // Chuyển đổi từ chuỗi thành số
  @IsInt({ message: 'Giá phải là số nguyên' })
  @Min(0, { message: 'Giá phải lớn hơn hoặc bằng 0' })
  price: number;

  @IsOptional()
  notes: string;

  @IsOptional()
  start_date_use: Date;

  @Type(() => Number)
  @IsNotEmpty({ message: 'floor_id không được bỏ trống' })
  @IsInt({ message: 'floor_id phải là số nguyên' })
  floor_id: number;

  @Type(() => Number)
  @IsNotEmpty({ message: 'room_type_id không được bỏ trống' })
  @IsOptional()
  @IsInt({ message: 'room_type_id phải là số nguyên' })
  room_type_id: number;
}
