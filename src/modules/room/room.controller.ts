import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/createRoom.dto';
import { RoomEntity } from 'src/entities/room.entity';
import { ResponData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { UpdateRoomDto } from './dto/updateRoom.dto';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';
import { GetUser } from 'src/decorator/user.decorator';
import { dot } from 'node:test/reporters';

@Controller('room')
export class roomController {
  constructor(private readonly roomService: RoomService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body(new ValidationPipe()) createRoomDto: CreateRoomDto,
    @GetUser()
    user: any,
  ): Promise<ResponData<CreateRoomDto>> {
    try {
      const user_id = user._id;
      const room = await this.roomService.createRoom(createRoomDto, user_id);
      return new ResponData(room, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponData(null, HttpStatus.ERROR, `Lỗi: ${error.message}`);
    }
  }
  // Sửa phòng
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body(new ValidationPipe()) dto: CreateRoomDto,
  ): Promise<ResponData<string>> {
    try {
      const room = await this.roomService.updateRoom(id, dto);
      return new ResponData(room, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponData(null, HttpStatus.ERROR, `Lỗi: ${error.message}`);
    }
  }
  // Xóa phòng
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Param('id') id: number,
    @GetUser()
    user: any,
  ): Promise<ResponData<any>> {
    try {
      const user_id = user._id;
      const result = await this.roomService.deleteRoom(id, user_id);
      return new ResponData(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponData(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get('info-bookings/:hotel_id')
  async getAllRoomsWithBookings(
    @Param('hotel_id', ParseIntPipe) hotel_id: number,
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
    @Param('hotel_id', ParseIntPipe) hotel_id: number,
  ): Promise<ResponData<any>> {
    try {
      const rooms =
        await this.roomService.getAllRoomsWithBookingsToday(hotel_id);
      return new ResponData(rooms, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponData(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get('info-roomsWithCustomerToday/:hotel_id')
  async getRoomsWithCustomerToday(
    @Param('hotel_id', ParseIntPipe) hotel_id: number,
  ): Promise<ResponData<any>> {
    try {
      const rooms = await this.roomService.getRoomsWithCustomerToday(hotel_id);
      return new ResponData(rooms, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponData(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  // Lấy phòng theo ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(
    @Param('id') id: number,
    @GetUser()
    user: any,
  ): Promise<ResponData<string>> {
    try {
      const user_id = user._id;
      const room = await this.roomService.getRoom(id, user_id);
      return new ResponData(room, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponData(null, HttpStatus.ERROR, `Lỗi: ${error.message}`);
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
  @Get('/getrooms/all')
  async getRoomsByUser(
    @GetUser()
    user: any,
  ) {
    try {
      const user_id = user._id;
      const room = await this.roomService.getRoomsByUser(user_id);
      return new ResponData(room, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponData(null, HttpStatus.ERROR, `Lỗi: ${error.message}`);
    }
  }
}
