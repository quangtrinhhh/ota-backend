import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

export class UpdateRoomTypeDto {
  @IsOptional()
  @IsNotEmpty({ message: 'name không được để trống' })
  name?: string;

  @IsOptional()
  notes?: string;
  @IsNotEmpty({ message: 'hotel_id không tồn tại' })
  hotel_id?: number;
}
