import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { BookingRoomService } from './bookingroom.service';
import { CreateBookingRoomDto } from './dto/creatBookingRoom';
import { UpdateBookingRoomDto } from './dto/updateBookingRoom';
import { ResponData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { BookingRoom } from 'src/models/bookingroom.model'; // 
import { BookingRoomEntity } from 'src/entities/bookingRoom.entity';

@Controller('booking-rooms')
export class BookingRoomController {
    constructor(private readonly bookingRoomService: BookingRoomService) {}

    // Helper function to handle responses
    private handleResponse<T>(data: T, success: boolean, message: string): ResponData<T> {
        return new ResponData<T>(data, success ? HttpStatus.SUCCESS : HttpStatus.ERROR, message);
    }

    // Lấy tất cả các BookingRoom
    @Get()
    async getBookingRooms(): Promise<ResponData<BookingRoomEntity[]>> {
        try {
            const bookingRooms = await this.bookingRoomService.findAllBookingRooms();
            return this.handleResponse(bookingRooms, true, HttpMessage.SUCCESS);
        } catch (error) {
            return this.handleResponse(null, false, HttpMessage.ERROR);
        }
    }

    // Lấy chi tiết BookingRoom theo ID
    @Get(':id')
    async getBookingRoomById(@Param('id') id: number): Promise<ResponData<BookingRoomEntity>> {
        try {
            const bookingRoom = await this.bookingRoomService.findBookingRoomById(id);
            return this.handleResponse(bookingRoom, true, HttpMessage.SUCCESS);
        } catch (error) {
            return this.handleResponse(null, false, HttpMessage.ERROR);
        }
    }

    // Tạo mới BookingRoom
    @Post()
    async createBookingRoom(@Body(new ValidationPipe()) createBookingRoomDto: CreateBookingRoomDto): Promise<ResponData<BookingRoomEntity>> {
        try {
            const bookingRoom = await this.bookingRoomService.createBookingRoom(createBookingRoomDto);
            return this.handleResponse(bookingRoom, true, HttpMessage.SUCCESS);
        } catch (error) {
            return this.handleResponse(null, false, HttpMessage.ERROR);
        }
    }

    // Cập nhật BookingRoom theo ID
    @Put(':id')
    async updateBookingRoom(
        @Param('id') id: number,
        @Body(new ValidationPipe()) updateBookingRoomDto: UpdateBookingRoomDto,
    ): Promise<ResponData<string>> {
        try {
            // Trả về thông báo thành công thay vì thực thể
            await this.bookingRoomService.updateBookingRoom(id, updateBookingRoomDto);
            return this.handleResponse('BookingRoom updated successfully', true, HttpMessage.SUCCESS);
        } catch (error) {
            return this.handleResponse(null, false, HttpMessage.ERROR);
        }
    }

    // Xóa BookingRoom theo ID
    @Delete(':id')
    async deleteBookingRoom(@Param('id') id: number): Promise<ResponData<string>> {
        try {
            // Trả về thông báo thành công khi xóa
            await this.bookingRoomService.deleteBookingRoom(id);
            return this.handleResponse('BookingRoom deleted successfully', true, HttpMessage.SUCCESS);
        } catch (error) {
            return this.handleResponse(null, false, HttpMessage.ERROR);
        }
    }
}