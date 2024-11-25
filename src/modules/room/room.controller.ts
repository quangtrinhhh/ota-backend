import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/createRoom.dto';
import { RoomEntity } from 'src/entities/room.entity';
import { ResponData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { UpdateRoomDto } from './dto/updateRoom.dto';

@Controller('room')
export class roomController {
  constructor(private readonly roomService: RoomService) { }
  @Post()
  async create(
    @Body(new ValidationPipe()) createRoomDto: CreateRoomDto,
  ): Promise<ResponData<CreateRoomDto>> {
    try {
      const room = await this.roomService.createRoom(createRoomDto);
      return new ResponData(room, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponData(error, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
  // Sửa phòng
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body(new ValidationPipe()) UpdateRoomDto: UpdateRoomDto,
  ): Promise<ResponData<string>> {
    try {
      const room = await this.roomService.updateRoom(id, UpdateRoomDto);
      return new ResponData(room, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponData(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
  // Xóa phòng
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<ResponData<any>> {
    try {
      const result = await this.roomService.deleteRoom(id);
      return new ResponData(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponData(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get('info-bookings/:hotel_id')
  async getAllRoomsWithBookings(
    @Param('hotel_id', ParseIntPipe) hotel_id: number
  ): Promise<ResponData<any>> {
    try {
      const rooms = await this.roomService.getAllRoomsWithBookings(hotel_id);
      return new ResponData(rooms, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponData(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get('info-bookingsToday/:hotel_id')
  async getAllRoomsWithBookingsToday(
    @Param('hotel_id', ParseIntPipe) hotel_id: number
  ): Promise<ResponData<any>> {
    try {
      const rooms = await this.roomService.getAllRoomsWithBookingsToday(hotel_id);
      return new ResponData(rooms, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponData(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get('info-roomsWithCustomerToday/:hotel_id')
  async getRoomsWithCustomerToday(
    @Param('hotel_id', ParseIntPipe) hotel_id: number
  ): Promise<ResponData<any>> {
    try {
      const rooms = await this.roomService.getRoomsWithCustomerToday(hotel_id);
      return new ResponData(rooms, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponData(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  // Lấy phòng theo ID
  @Get(':id')
  async getOne(@Param('id') id: number): Promise<ResponData<string>> {
    try {
      const room = await this.roomService.getRoom(id);
      return new ResponData(room, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponData(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
  //  lấy tất cả
  @Get()
  async getAll(): Promise<ResponData<any>> {
    try {
      const rooms = await this.roomService.getAllRooms();
      return new ResponData(rooms, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponData(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get('details/:id') // Endpoint lấy thông tin chi tiết phòng
  async getRoomDetails(@Param('id') id: number) {
    return await this.roomService.getRoomDetails(+id);
  }
}
