import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateBookingRoomDto {
  @IsInt()
  @IsPositive()
  price: number;

  @IsInt()
  @IsPositive()
  booking_id: number;

  @IsInt()
  @IsPositive()
  room_id: number;

  @IsNotEmpty({ message: 'price_type không được để trống' })
  price_type: 'hourly_rate' | 'daily_rate' | 'overnight_rate';

  @IsInt()
  @IsPositive()
  hotel_id: number;
}
