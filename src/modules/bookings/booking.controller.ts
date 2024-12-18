import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/createBooking.dto';
import { UpdateBookingDto } from './dto/updateBooking.dto';
import { ResponData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { Booking } from 'src/models/booking.model';
import { RoomEntity } from 'src/entities/room.entity';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // Lấy tất cả các booking
  @Get()
  async getBookings(): Promise<ResponData<Booking[]>> {
    try {
      const bookings = await this.bookingService.getBookings();
      return new ResponData<Booking[]>(
        bookings,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<Booking[]>(
        null,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  // Lấy chi tiết booking theo ID
  @Get(':id')
  async getBookingById(@Param('id') id: number): Promise<ResponData<Booking>> {
    try {
      const booking = await this.bookingService.getBookingById(id);
      return new ResponData<Booking>(
        booking,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<Booking>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  // Tạo mới booking
  @Post()
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<any> {
    try {
      // Tạo đặt phòng bằng DTO
      const newBookings =
        await this.bookingService.createBooking(createBookingDto);
      return new ResponData(
        newBookings,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      if (error.message === 'Some rooms are not available') {
        return new ResponData(null, HttpStatus.ERROR, error.message);
      }
      throw new BadRequestException('Error creating booking', error);
    }
  }

  // Cập nhật booking theo ID
  @Put(':id')
  async updateBooking(
    @Param('id') id: number,
    @Body(new ValidationPipe()) updateBookingDto: UpdateBookingDto,
  ): Promise<ResponData<string>> {
    try {
      const response = await this.bookingService.updateBooking(
        id,
        updateBookingDto,
      );
      return new ResponData<string>(
        response,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  // Xóa booking theo ID
  @Delete(':id')
  async deleteBooking(@Param('id') id: number): Promise<ResponData<string>> {
    try {
      const response = await this.bookingService.deleteBooking(id);
      return new ResponData<string>(
        response,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  // Lấy chi tiết booking theo ID
  @Get('bookingRoomsWithCustomerByRoomId/:room_id')
  async getBookingRoomsWithCustomerById(
    @Param('room_id') room_id: number,
  ): Promise<ResponData<Booking>> {
    try {
      const booking =
        await this.bookingService.getbookingRoomsWithCustomerByRoomId(room_id);
      return new ResponData<Booking>(
        booking,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<Booking>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get('/available/rooms')
  async getAvailableRooms(
    @Query('hotelId') hotelId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Kiểm tra ngày hợp lệ
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return new ResponData(null, HttpStatus.ERROR, 'Ngày không hợp lệ');
    }

    try {
      const rooms = await this.bookingService.getAvailableRooms(
        hotelId,
        start,
        end,
      );
      return new ResponData(rooms, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponData(
        null,
        HttpStatus.ERROR,
        error?.message || 'Đã xảy ra lỗi',
      );
    }
  }
  @Get('rooms/types')
  async getRoomTypes() {
    try {
      const availableRooms = await this.bookingService.getRoomTypes();
      console.log('Available Rooms:', availableRooms); // Kiểm tra dữ liệu từ service
      if (!availableRooms || availableRooms.length === 0) {
        throw new Error('No available rooms found');
      }
      return { data: availableRooms };
    } catch (error) {
      console.error('Error in getRoomTypes:', error.message); // Log lỗi chi tiết
      return { message: error.message, statusCode: 500 };
    }
  }
  @Get('/history/bookings')
  async getBookingHistory(@Query('hotelId') hotelId: number) {
    try {
      const historyBookings =
        await this.bookingService.getBookingHistory(hotelId);
      return new ResponData(
        historyBookings,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData(
        null,
        HttpStatus.ERROR,
        error?.message || 'Đã xảy ra lỗi',
      );
    }
  }
}
