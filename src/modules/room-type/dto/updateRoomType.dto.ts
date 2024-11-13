import { Type } from 'class-transformer';
import { IsInt, IsOptional, MinLength } from 'class-validator';

export class UpdateRoomTypeDto {
  @IsOptional()
  @MinLength(1, { message: 'Name phải nhập ít nhất 1 ký tự.' })
  name?: string;

  @IsOptional()
  @MinLength(1, { message: 'nost phải nhập ít nhất 1 ký tự.' })
  notes?: string;

  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: 'hotel_id phải là số nguyên' })
  hotel_id?: number;
}
