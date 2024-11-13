// dtos/update-booking-room.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingRoomDto } from './creatBookingRoom';

export class UpdateBookingRoomDto extends PartialType(CreateBookingRoomDto) {}
