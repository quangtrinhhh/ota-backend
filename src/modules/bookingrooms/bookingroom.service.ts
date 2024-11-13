import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingRoomEntity } from 'src/entities/bookingRoom.entity'; // Chỉnh sửa đường dẫn nếu cần
import { CreateBookingRoomDto } from './dto/creatBookingRoom';
import { UpdateBookingRoomDto } from './dto/updateBookingRoom';

@Injectable()
export class BookingRoomService {
    constructor(
        @InjectRepository(BookingRoomEntity)
        private readonly bookingRoomRepository: Repository<BookingRoomEntity>,
    ) {}

    // Phương thức tạo mới BookingRoom
    async createBookingRoom(data: CreateBookingRoomDto): Promise<BookingRoomEntity> {
        const bookingRoom = this.bookingRoomRepository.create({
            price: data.price,
            booking_id: data.bookingId,
            room_id: data.roomId,
            hotel_id: data.hotelId,
        });
        return await this.bookingRoomRepository.save(bookingRoom);
    }

    // Phương thức cập nhật BookingRoom
    async updateBookingRoom(id: number, data: UpdateBookingRoomDto): Promise<BookingRoomEntity> {
        let bookingRoom: BookingRoomEntity;

        try {
            // Sử dụng findOne với FindOneOptions
            bookingRoom = await this.bookingRoomRepository.findOne({ where: { id } });
        } catch (error) {
            throw new NotFoundException(`BookingRoom with ID ${id} not found`);
        }

        // Cập nhật các trường nếu có thay đổi
        bookingRoom.price = data.price ?? bookingRoom.price;
        bookingRoom.booking_id = data.bookingId ?? bookingRoom.booking_id;
        bookingRoom.room_id = data.roomId ?? bookingRoom.room_id;
        bookingRoom.hotel_id = data.hotelId ?? bookingRoom.hotel_id;

        return await this.bookingRoomRepository.save(bookingRoom);
    }

    // Phương thức tìm BookingRoom theo ID
    async findBookingRoomById(id: number): Promise<BookingRoomEntity> {
        try {
            // Sử dụng findOne với FindOneOptions
            return await this.bookingRoomRepository.findOne({ where: { id } });
        } catch (error) {
            throw new NotFoundException(`BookingRoom with ID ${id} not found`);
        }
    }

    // Phương thức lấy tất cả BookingRooms
    async findAllBookingRooms(): Promise<BookingRoomEntity[]> {
        return this.bookingRoomRepository.find();
    }

    // Phương thức xóa BookingRoom
    async deleteBookingRoom(id: number): Promise<void> {
        let bookingRoom: BookingRoomEntity;

        try {
            // Sử dụng findOne với FindOneOptions
            bookingRoom = await this.bookingRoomRepository.findOne({ where: { id } });
        } catch (error) {
            throw new NotFoundException(`BookingRoom with ID ${id} not found`);
        }

        await this.bookingRoomRepository.remove(bookingRoom);
    }
}