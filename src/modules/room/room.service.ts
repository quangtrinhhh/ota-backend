import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from 'src/entities/room.entity';
import { Between, Not, Repository } from 'typeorm';
import { CreateRoomDto } from './dto/createRoom.dto';
import { RoomTypeEntity } from 'src/entities/roomType.entity';
import { HotelEntity } from 'src/entities/hotel.entity';
import {
  ConflictException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { HttpStatus } from 'src/global/globalEnum';
import { UpdateRoomDto } from './dto/updateRoom.dto';
import { log } from 'console';
import { UserEntity } from 'src/entities/user.entity';
import { FloorEntity } from 'src/entities/floor.entity';
import { BookingEntity } from 'src/entities/booking.entity';
import { BookingRoomEntity } from 'src/entities/bookingRoom.entity';

export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private roomRepository: Repository<RoomEntity>,
    @InjectRepository(RoomTypeEntity)
    private readonly roomTypeRepository: Repository<RoomTypeEntity>,

    @InjectRepository(HotelEntity)
    private readonly hotelRepository: Repository<HotelEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FloorEntity)
    private floorRepository: Repository<FloorEntity>,
    @InjectRepository(BookingRoomEntity)
    private readonly bookingRoomRepository: Repository<BookingRoomEntity>,
  ) {}
  //tạo phòng
  async createRoom(dto: CreateRoomDto, user_id: number): Promise<any> {
    const { name, price, room_type_id, floor_id, notes, start_date_use } = dto;

    // Lấy thông tin khách sạn từ user_id
    const hotelId = await this.getHotelIdByUser(user_id);

    // Kiểm tra sự tồn tại của room_type_id và floor_id thuộc khách sạn của người dùng
    const roomType = await this.roomTypeRepository.findOne({
      where: {
        id: room_type_id,
        hotel_id: hotelId, // Ràng buộc rằng roomType phải thuộc khách sạn của người dùng
      },
    });
    if (!roomType) {
      throw new Error(
        'Hạng phòng không hợp lệ hoặc không thuộc khách sạn của bạn',
      );
    }

    const floor = await this.floorRepository.findOne({
      where: {
        id: floor_id,
        hotel_id: hotelId,
      },
    });
    if (!floor) {
      throw new Error('Vui lòng điền khu vực');
    }

    const hotel = await this.hotelRepository.findOne({
      where: { id: hotelId },
    });
    if (!hotel) {
      throw new Error('Hotel không hợp lệ');
    }

    // Kiểm tra xem tên phòng đã tồn tại trong khách sạn chưa
    const existingRoom = await this.roomRepository.findOne({
      where: {
        name: name,
        hotel_id: hotelId, // Tên phòng phải là duy nhất trong khách sạn này
      },
    });

    if (existingRoom) {
      throw new Error('Tên phòng đã tồn tại trong khách sạn này');
    }

    // Tạo phòng mới
    const room = this.roomRepository.create({
      name,
      price,
      room_type: roomType,
      floor,
      hotel,
      room_type_id,
      floor_id,
      hotel_id: hotelId, // Không cần truyền từ DTO nữa, tự động lấy từ người dùng
      notes,
      start_date_use,
    });

    return await this.roomRepository.save(room);
  }

  //   update
  async updateRoom(id: number, updateRoomDto: UpdateRoomDto): Promise<any> {
    // Tìm phòng theo ID
    console.log('Payload received:', updateRoomDto);

    const room = await this.roomRepository.findOne({ where: { id } });
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    // Kiểm tra tên phòng mới nếu được truyền
    if (updateRoomDto.name !== undefined && updateRoomDto.name !== null) {
      const existingRoom = await this.roomRepository.findOne({
        where: {
          name: updateRoomDto.name,
          id: Not(id), // Đảm bảo không tìm chính phòng đang cập nhật
        },
      });

      if (existingRoom) {
        throw new ConflictException(
          `Phòng có tên ${updateRoomDto.name} đã tồn tại!`,
        );
      }
      room.name = updateRoomDto.name; // Cập nhật tên phòng
    }

    // Kiểm tra và gán giá trị mới cho `clean_status`
    if (updateRoomDto.clean_status !== undefined) {
      room.clean_status = updateRoomDto.clean_status;
    }

    // Gán các giá trị khác từ `updateRoomDto` (nếu có)
    Object.keys(updateRoomDto).forEach((key) => {
      if (updateRoomDto[key] !== undefined && key !== 'name') {
        room[key] = updateRoomDto[key];
      }
    });

    // Lưu thông tin cập nhật
    const updatedRoom = await this.roomRepository.save(room);
    return updatedRoom;
  }

  //   xóa
  async deleteRoom(id: number, user_id: number): Promise<string> {
    try {
      // Lấy thông tin khách sạn từ user_id
      const hotelId = await this.getHotelIdByUser(user_id);
      if (!hotelId) {
        return 'Hotel not found for this user'; // Kiểm tra nếu không tìm thấy khách sạn cho user
      }

      // Kiểm tra xem phòng có tồn tại không và thuộc về khách sạn của người dùng
      const room = await this.roomRepository.findOne({
        where: { id, hotel_id: hotelId },
      });

      if (!room) {
        throw new Error(`Room with ID ${id} not found in this hotel`); // Kiểm tra nếu phòng không tồn tại trong khách sạn của user
      }

      // Kiểm tra phòng có liên kết với bất kỳ booking nào không (dựa trên bảng BookingRoomEntity)
      const bookingRooms = await this.bookingRoomRepository.find({
        where: { room_id: id },
      });

      if (bookingRooms.length > 0) {
        throw new Error(
          `Phòng này hiện đang có booking vui lòng xử lý trước khi xóa`,
        );
        // Phòng đã được đặt, không thể xóa
      }

      // Xóa phòng
      await this.roomRepository.remove(room);

      return `Room with ID ${id} deleted successfully`;
    } catch (error) {
      throw new error();
    }
  }
  //   lấy 1 room
  async getRoom(id: number, user_id: number): Promise<any> {
    // Lấy thông tin khách sạn của người dùng
    const hotelId = await this.getHotelIdByUser(user_id);

    if (!hotelId) {
      throw new Error(
        `Không tìm thấy khách sạn cho người dùng với ID ${user_id}`,
      );
    }

    // Tìm phòng theo ID và kiểm tra xem phòng có thuộc khách sạn của người dùng không
    const room = await this.roomRepository.findOne({
      where: { id, hotel_id: hotelId }, // Kiểm tra phòng thuộc khách sạn của người dùng
    });

    if (!room) {
      throw new Error(
        `Phòng với ID ${room.name} không tồn tại hoặc không thuộc khách sạn của bạn`,
      );
    }

    return room;
  }
  //   lấy tất cả
  async getAllRooms(): Promise<any> {
    return await this.roomRepository.find();
  }
  async getRoomsByUser(user_id: number): Promise<any> {
    // Lấy hotel_id từ user_id
    const hotelId = await this.getHotelIdByUser(user_id);

    if (!hotelId) {
      throw new Error(
        'Không tìm thấy khách sạn nào thuộc quyền quản lý của bạn',
      );
    }

    // Truy vấn lấy danh sách phòng thuộc khách sạn
    const rooms = await this.roomRepository.find({
      where: { hotel_id: hotelId },
      relations: ['room_type', 'floor'], // Nếu cần lấy cả thông tin liên kết
    });

    return rooms;
  }

  async getAllRoomsWithBookings(hotel_id: number): Promise<any> {
    const rooms = await this.roomRepository.find({
      where: { hotel: { id: hotel_id } },
      relations: [
        'room_type', // Liên kết với RoomType
        'floor', // Liên kết với Floor
        'hotel', // Liên kết với Hotel
        'booking_rooms', // Liên kết với BookingRoom
        'booking_rooms.booking', // Liên kết với BookingEntity để lấy check_in_at, check_out_at
      ],
    });

    return rooms.map((room) => ({
      id: room.id,
      name: room.name,
      clean_status: room.clean_status,
      status: room.status,
      price: room.price,
      room_type: room.room_type?.name, // Lấy tên loại phòng
      floor: room.floor?.name, // Lấy tên tầng
      hotel: room.hotel?.name,
      hotel_id: room.hotel?.id, // Lấy tên khách sạn
      bookings: room.booking_rooms
        .filter((bookingRoom) => bookingRoom.booking.status !== 'Cancelled')
        .map((bookingRoom) => ({
          id: bookingRoom.booking.id,
          booking_at: bookingRoom.booking.booking_at,
          check_in_at: bookingRoom.booking.check_in_at,
          check_out_at: bookingRoom.booking.check_out_at,
          status: bookingRoom.booking.status,
        })),
    }));
  }

  async getAllRoomsWithBookingsToday(hotel_id: number): Promise<any> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Đặt giờ thành 00:00:00 để so sánh với ngày hôm nay
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1); // Ngày mai (sử dụng để so sánh với ngày hôm nay)

      // Ngày hôm qua
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1); // Ngày hôm qua

      console.log('Today (VN):', today);
      console.log('Tomorrow (VN):', tomorrow);
      console.log('Yesterday (VN):', yesterday);
      // Lấy tất cả các phòng cùng với thông tin booking
      const rooms = await this.roomRepository.find({
        where: { hotel: { id: hotel_id } },
        relations: [
          'room_type',
          'floor',
          'hotel',
          'booking_rooms',
          'booking_rooms.booking',
        ],
        order: {
          name: 'ASC',
        },
      });

      const allRooms = [];

      rooms.forEach((room) => {
        // Lọc các booking của phòng, chỉ lấy booking có đặt phòng là hôm nay
        const bookingsToday = room.booking_rooms.filter((bookingRoom) => {
          const bookingDate = new Date(bookingRoom.booking.booking_at);
          return (
            bookingDate >= today &&
            bookingDate < tomorrow &&
            bookingRoom.booking.status !== 'Booked'
          );
        });

        // Lọc các booking của phòng, chỉ lấy booking có check_in_at là hôm qua và check_out_at chưa qua hôm nay
        const bookingsInUse = room.booking_rooms.filter((bookingRoom) => {
          const checkInDate = new Date(bookingRoom.booking.check_in_at);
          const checkOutDate = new Date(bookingRoom.booking.check_out_at);

          checkInDate.setHours(0, 0, 0, 0);

          // Kiểm tra check_in_at là sau ngày hôm qua và check_out_at chưa qua hôm nay
          return (
            checkInDate <= yesterday &&
            checkInDate < today &&
            checkOutDate >= today &&
            bookingRoom.booking.status !== 'Cancelled' &&
            bookingRoom.booking.status !== 'CheckedOut' &&
            bookingRoom.booking.status !== 'NoShow'
          );
        });

        const roomData = {
          id: room.id,
          name: room.name,
          clean_status: room.clean_status,
          status: room.status, // Phòng đã đặt hoặc trống
          price: room.price,
          room_type: room.room_type?.name,
          floor: room.floor,
          hotel: room.hotel?.name,
          hotel_id: room.hotel?.id,
          bookings:
            bookingsToday.length > 0 || bookingsInUse.length > 0
              ? [...bookingsToday, ...bookingsInUse].map((bookingRoom) => ({
                  id: bookingRoom.booking.id,
                  booking_at: bookingRoom.booking.booking_at,
                  check_in_at: bookingRoom.booking.check_in_at,
                  check_out_at: bookingRoom.booking.check_out_at,
                  status: bookingRoom.booking.status,
                }))
              : null,
        };

        allRooms.push(roomData);
      });

      return allRooms;
    } catch (error) {
      console.error('Error fetching room status for today:', error);
      throw new Error('Unable to fetch room status for today');
    }
  }

  async getRoomsWithCustomerToday(hotel_id: number): Promise<any> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Đặt giờ thành 00:00:00 để so sánh với ngày hôm nay
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1); // Ngày mai (sử dụng để so sánh với ngày hôm nay)

      // Ngày hôm qua
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1); // Ngày hôm qua

      // Lấy tất cả các phòng cùng với thông tin booking
      const rooms = await this.roomRepository.find({
        where: { hotel: { id: hotel_id } },
        relations: [
          'room_type',
          'floor',
          'hotel',
          'booking_rooms',
          'booking_rooms.booking',
          'booking_rooms.booking.customer',
          'booking_rooms.booking.invoices',
        ],
        order: {
          name: 'ASC',
        },
      });

      const allRooms = [];

      rooms.forEach((room) => {
        // Lọc các booking của phòng, chỉ lấy booking có đặt phòng là hôm nay
        const bookingsToday = room.booking_rooms.filter((bookingRoom) => {
          const bookingDate = new Date(bookingRoom.booking.booking_at);
          return bookingDate >= today && bookingDate < tomorrow;
        });

        // Lọc các booking của phòng, chỉ lấy booking có check_in_at là hôm qua và check_out_at chưa qua hôm nay
        const bookingsInUse = room.booking_rooms.filter((bookingRoom) => {
          const checkInDate = new Date(bookingRoom.booking.check_in_at);
          const checkOutDate = new Date(bookingRoom.booking.check_out_at);

          checkInDate.setHours(0, 0, 0, 0);

          // Kiểm tra check_in_at là sau ngày hôm qua và check_out_at chưa qua hôm nay
          return (
            checkInDate <= yesterday &&
            checkInDate < today &&
            checkOutDate >= today
          );
        });

        if (bookingsInUse.length > 0 || bookingsToday.length > 0) {
          const validBookings = [...bookingsToday, ...bookingsInUse].filter(
            (bookingRoom) => bookingRoom.booking.status !== 'Cancelled',
          );

          if (validBookings.length > 0) {
            const roomData = {
              id: room.id,
              name: room.name,
              hotel_id: room.hotel?.id,
              bookings: [...bookingsToday, ...bookingsInUse].map(
                (bookingRoom) => ({
                  // id: bookingRoom.booking.id,
                  // booking_at: bookingRoom.booking.booking_at,
                  // check_in_at: bookingRoom.booking.check_in_at,
                  // check_out_at: bookingRoom.booking.check_out_at,
                  // status: bookingRoom.booking.status,
                  customer: {
                    id: bookingRoom.booking.customer?.id,
                    name: bookingRoom.booking.customer?.name,
                    // email: bookingRoom.booking.customer?.email,
                    // phone: bookingRoom.booking.customer?.phone,
                  },
                  invoice:
                    bookingRoom.booking.invoices &&
                    bookingRoom.booking.invoices.length > 0
                      ? bookingRoom.booking.invoices.map((invoice) => ({
                          id: invoice.id,
                          // issue_at: invoice.issue_at,
                          // total_amount: invoice.total_amount,
                          // discount_amount: invoice.discount_amount,
                          // discount_percentage: invoice.discount_percentage,
                          // payment_method: invoice.payment_method,
                          status: invoice.status,
                        }))
                      : null,
                }),
              ),
            };
            allRooms.push(roomData);
          }
        }
      });

      return allRooms;
    } catch (error) {
      console.error('Error fetching room status for today:', error);
      throw new Error('Unable to fetch room status for today');
    }
  }

  /**
   * Lấy ID khách sạn của người dùng
   */
  async getHotelIdByUser(userId: number): Promise<number> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) throw new Error('User not found');
    return user.hotel_id;
  }

  async getRoomDetails(room_id: number): Promise<any> {
    // Tìm thông tin phòng cụ thể theo `room_id` và các quan hệ liên quan
    const room = await this.roomRepository.findOne({
      where: { id: room_id }, // Lọc theo `room_id`
      relations: [
        'room_type', // Liên kết với RoomType
        'floor', // Liên kết với Floor
        'hotel', // Liên kết với Hotel
        'booking_rooms', // Liên kết với BookingRoom
        'booking_rooms.booking', // Liên kết với BookingEntity để lấy thông tin đặt phòng
      ],
    });

    if (!room) {
      throw new Error('Room not found'); // Xử lý nếu không tìm thấy phòng
    }

    // Xử lý dữ liệu trả về
    return {
      id: room.id,
      name: room.name,
      clean_status: room.clean_status,
      status: room.status,
      price: room.price,
      room_type: room.room_type?.name || null, // Tên loại phòng (nếu có)
      floor: room.floor?.name || null, // Tên tầng (nếu có)
      hotel: {
        id: room.hotel?.id || null,
        name: room.hotel?.name || null, // Thông tin khách sạn (nếu có)
      },
      bookings: room.booking_rooms
        .filter((bookingRoom) => bookingRoom.booking.status !== 'Cancelled') // Loại bỏ các booking bị hủy
        .map((bookingRoom) => ({
          id: bookingRoom.booking.id,
          booking_at: bookingRoom.booking.booking_at,
          check_in_at: bookingRoom.booking.check_in_at,
          check_out_at: bookingRoom.booking.check_out_at,
          children: bookingRoom.booking.children,
          adults: bookingRoom.booking.adults,
          status: bookingRoom.booking.status,
        })),
    };
  }
}
