import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty({ message: 'Tên phòng không được bỏ trống' })
  name: string;

  @IsOptional()
  @IsEnum(['clean', 'dirty'], {
    message: 'Trạng thái dọn dẹp phải là clean hoặc dirty',
  })
  clean_status?: boolean;

  @IsOptional()
  @IsEnum(['available', 'booked'], {
    message: 'Trạng thái phải là available hoặc booked',
  })
  status?: string;

  @IsNotEmpty({ message: 'Giá phòng là bắt buộc' })
  @IsNumber()
  price: number;

  @IsNotEmpty({ message: 'Room Type ID là bắt buộc' })
  @IsNumber()
  room_type_id: number;

  @IsNotEmpty({ message: 'Hotel ID là bắt buộc' })
  @IsNumber()
  hotel_id: number;
}
