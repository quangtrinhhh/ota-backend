// src/room-type/roomType.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { RoomTypeService } from './roomType.service';
import { CreateRoomTypeDto } from './dto/createroomtype.dto';
import { ResponData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { UpdateRoomTypeDto } from './dto/updateRoomType.dto';

@Controller('room-type')
export class RoomTypeController {
  constructor(private readonly roomTypeService: RoomTypeService) {}

  // Tạo mới room type
  @Post()
  async create(
    @Body(new ValidationPipe()) createRoomTypeDto: CreateRoomTypeDto,
  ) {
    try {
      // Đảm bảo sử dụng await để lấy kết quả từ service
      const createRoomType =
        await this.roomTypeService.create(createRoomTypeDto);
      return new ResponData(
        createRoomType,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      console.error(error); // Ghi lại lỗi nếu có
      return new ResponData(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  // Lấy tất cả room type
  @Get()
  async findAllRoomType() {
    try {
      const findAllRoomType = await this.roomTypeService.findAllService();
      return new ResponData(
        findAllRoomType,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      console.error(error); // Ghi lại lỗi nếu có
      return new ResponData(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
  @Delete(':id')
  async deleteRoomType(@Param('id') id: number): Promise<ResponData<string>> {
    try {
      return new ResponData<string>(
        await this.roomTypeService.deleteRoomType(id),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Put(':id')
  async updateRoomType(
    @Param('id') id: string,
    @Body() updateRoomTypeDto: UpdateRoomTypeDto,
  ) {
    try {
      const updateRoomType = await this.roomTypeService.updateRoomType(
        Number(id),
        updateRoomTypeDto,
      );
      return new ResponData(
        updateRoomType,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      console.error(error);
      return new ResponData(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
