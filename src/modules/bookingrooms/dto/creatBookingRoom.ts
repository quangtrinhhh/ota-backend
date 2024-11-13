// dtos/create-booking-room.dto.ts
import { IsInt, IsNumber } from 'class-validator';

export class CreateBookingRoomDto {
    @IsNumber()
    price: number;

    @IsInt()
    bookingId: number;

    @IsInt()
    roomId: number;

    @IsInt()
    hotelId: number;
}
