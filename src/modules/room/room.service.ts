import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from 'src/entities/room.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/createRoom.dto';
import { RoomTypeEntity } from 'src/entities/roomType.entity';
import { HotelEntity } from 'src/entities/hotel.entity';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from 'src/global/globalEnum';
import { UpdateRoomDto } from './dto/updateRoom.dto';

export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private roomRepository: Repository<RoomEntity>,
    @InjectRepository(RoomTypeEntity)
    private readonly roomTypeRepository: Repository<RoomTypeEntity>,

    @InjectRepository(HotelEntity)
    private readonly hotelRepository: Repository<HotelEntity>,
  ) {}
  //tạo phòng
  async createRoom(CreateRoomDto: CreateRoomDto): Promise<RoomEntity> {
    // Sử dụng cú pháp đúng để tìm phòng theo room_type_id
    const roomType = await this.roomTypeRepository.findOne({
      where: { id: CreateRoomDto.room_type_id },
    });

    if (!roomType) {
      throw new HttpException(` room_type_id không tồn tại`, HttpStatus.ERROR);
    }

    // Kiểm tra xem hotel_id có hợp lệ không
    const hotel = await this.hotelRepository.findOne({
      where: { id: CreateRoomDto.hotel_id },
    });

    if (!hotel) {
      throw new HttpException(`hotel_id không tồn tại`, HttpStatus.ERROR);
    }

    // Tạo đối tượng phòng từ DTO
    const room = this.roomRepository.create(CreateRoomDto);

    // Lưu phòng vào cơ sở dữ liệu
    return await this.roomRepository.save(room);
  }
  //   update
  async updateRoom(id: number, updateRoomDto: UpdateRoomDto): Promise<any> {
    // Tìm phòng theo ID
    const room = await this.roomRepository.findOne({ where: { id } });
    if (!room) {
      return `Room with ID ${id} not found`;
    }

    // Cập nhật thông tin phòng
    Object.assign(room, updateRoomDto);
    const updatedRoom = await this.roomRepository.save(room);

    return updatedRoom;
  }
  //   xóa
  async deleteRoom(id: number): Promise<string> {
    // Tìm phòng theo ID
    const room = await this.roomRepository.findOne({ where: { id } });
    if (!room) {
      return `Room with ID ${id} not found`;
    }

    // Xóa phòng
    await this.roomRepository.remove(room);

    return `Room with ID ${id} deleted successfully`;
  }
  //   lấy 1 room
  async getRoom(id: number): Promise<any> {
    // Tìm phòng theo ID
    const room = await this.roomRepository.findOne({ where: { id } });
    if (!room) {
      return `Room with ID ${id} not found`;
    }

    return room;
  }
  //   lấy tất cả
  async getAllRooms(): Promise<RoomEntity[]> {
    return await this.roomRepository.find(); // Lấy tất cả phòng
  }
}
