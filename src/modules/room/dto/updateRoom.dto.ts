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
  @IsOptional()
  name: string;

  @IsOptional()
  price: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'clean_status phải là kiểu boolean' })
  clean_status: boolean;

  @IsOptional()
  status: string;

  @IsOptional()
  notes: string;

  @IsOptional()
  start_date_use: Date;

  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: 'floor_id phải là số nguyên' })
  floor_id: number;

  @Type(() => Number)
  @IsNotEmpty({ message: 'room_type_id không được bỏ trống' })
  @IsOptional()
  @IsInt({ message: 'room_type_id phải là số nguyên' })
  room_type_id: number;
}
