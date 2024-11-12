import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/createRoom.dto';
import { RoomEntity } from 'src/entities/room.entity';
import { ResponData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';

@Controller('room')
export class roomController {
  constructor(private readonly roomService: RoomService) {}
  @Post()
  async create(
    @Body() createRoomDto: CreateRoomDto,
  ): Promise<ResponData<RoomEntity>> {
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
    @Body() CreateRoomDto: CreateRoomDto,
  ): Promise<ResponData<RoomEntity>> {
    try {
      const room = await this.roomService.updateRoom(id, CreateRoomDto);
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
  // Lấy phòng theo ID
  @Get(':id')
  async getOne(@Param('id') id: number): Promise<ResponData<RoomEntity>> {
    try {
      const room = await this.roomService.getRoom(id);
      return new ResponData(room, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponData(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
  //    lấy tất cả
  @Get()
  async getAll(): Promise<ResponData<RoomEntity>> {
    try {
      const rooms = await this.roomService.getAllRooms();
      return new ResponData(rooms, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponData(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
