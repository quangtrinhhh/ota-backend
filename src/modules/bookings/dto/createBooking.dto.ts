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


  @IsString()
  @IsOptional()
  customer_name: string;

  @IsString()
  @IsOptional()
  customer_phone: string;

  @IsString()
  @IsOptional()
  customer_email: string;

  @IsString()
  @IsOptional()
  customer_gender: 'Male' | 'Female' | 'Other';

  @IsDateString()
  @IsOptional()
  customer_birthday: Date;

  @IsInt()
  hotel_id: number;

  @IsArray()
  booking_rooms: { room_id: number; price: number }[];

  @IsInt()
  children: number;

  @IsInt()
  adults: number;

  @IsOptional()
  @IsNumber()
  total_amount: number;

  @IsDateString()
  check_in_at: Date;

  @IsDateString()
  check_out_at: Date;
}
