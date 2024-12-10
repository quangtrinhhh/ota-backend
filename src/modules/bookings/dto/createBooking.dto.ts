import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsEnum,
  IsArray,
  ArrayNotEmpty,
  IsNotEmpty,
  IsPositive,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty({ message: 'Tên khách hàng không được để trống' })
  @IsString()
  customer_name: string;

  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsString()
  customer_phone: string;

  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsString()
  @IsOptional()
  customer_email: string;

  @IsString()
  @IsOptional()
  customer_gender: 'Male' | 'Female' | 'Other';

  @IsOptional()
  @IsDateString()
  customer_birthday: Date;

  @IsNotEmpty({ message: 'hotel_id không được để trống' })
  @IsInt()
  hotel_id: number;

  @IsNotEmpty({ message: 'booking_rooms không được để trống' })
  @IsArray()
  booking_rooms: {
    room_id: number;
    price: number;
    price_type: 'hourly_rate' | 'daily_rate' | 'overnight_rate';
  }[];

  @IsInt()
  children: number;

  @IsInt()
  adults: number;

  @IsOptional()
  @IsNumber()
  total_amount: number;

  @IsOptional()
  @IsDateString()
  check_in_at: Date;

  @IsDateString()
  check_out_at: Date;
}
