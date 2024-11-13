import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRoomTypeDto {
  @IsNotEmpty({ message: 'name room type không được để trống' })
  name: string;
  notes?: string;
  @IsNotEmpty({ message: 'hotel_id không được bỏ trống' })
  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: 'hotel_id phải là số nguyên' })
  hotel_id: number;
}
