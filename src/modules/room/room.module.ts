import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from 'src/entities/room.entity';
import { RoomService } from './room.service';
import { roomController } from './room.controller';
import { RoomTypeEntity } from 'src/entities/roomType.entity';
import { HotelEntity } from 'src/entities/hotel.entity';
import { UserEntity } from 'src/entities/user.entity';
import { FloorEntity } from 'src/entities/floor.entity';
import { BookingRoomEntity } from 'src/entities/bookingRoom.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoomEntity,
      RoomTypeEntity,
      HotelEntity,
      UserEntity,
      FloorEntity,
      BookingRoomEntity,
    ]),
  ],
  providers: [RoomService],
  controllers: [roomController],
})
export class RoomModule {}
