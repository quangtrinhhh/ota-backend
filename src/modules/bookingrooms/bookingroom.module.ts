import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingRoomService } from './bookingroom.service';
import { BookingRoomController } from './bookingroom.controller';
import { BookingRoomEntity } from 'src/entities/bookingRoom.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookingRoomEntity])], // Đăng ký BookingRoomEntity với TypeOrm
  controllers: [BookingRoomController], // Đăng ký controller
  providers: [BookingRoomService], // Đăng ký service
  exports: [BookingRoomService], // Xuất service nếu cần dùng ở nơi khác
})
export class BookingRoomModule {}
