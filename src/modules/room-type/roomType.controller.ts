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
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { RoomTypeService } from './roomType.service';
import { CreateRoomTypeDto } from './dto/createroomtype.dto';
import { ResponData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { UpdateRoomTypeDto } from './dto/updateRoomType.dto';
import { promises } from 'dns';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';
import { GetUser } from 'src/decorator/user.decorator';
import { RoomTypeStatus } from 'src/entities/roomType.entity';

@Controller('room-type')
export class RoomTypeController {
  constructor(private readonly roomTypeService: RoomTypeService) {}

  // Tạo mới room type
  @Post()
  @UseGuards(JwtAuthGuard)
  async createRoomType(
    @Body(new ValidationPipe()) createRoomTypeDto: CreateRoomTypeDto,
    @GetUser()
    user: any,
  ): Promise<ResponData<CreateRoomTypeDto>> {
    try {
      const user_id = user._id;
      // Đảm bảo sử dụng await để lấy kết quả từ service
      const createRoomType = await this.roomTypeService.createRoomType(
        createRoomTypeDto,
        user_id,
      );
      return new ResponData(
        createRoomType,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData(null, HttpStatus.ERROR, `Lỗi: ${error.message}`);
    }
  }

  // Lấy tất cả room type
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllRoomType(
    @GetUser()
    user: any,
  ) {
    try {
      const user_id = user._id;
      const findAllRoomType =
        await this.roomTypeService.findAllRoomType(user_id);
      return new ResponData(
        findAllRoomType,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData(null, HttpStatus.ERROR, `Lỗi: ${error.message}`);
    }
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteRoomType(
    @Param('id') id: number,
    @GetUser()
    user: any,
  ): Promise<ResponData<string>> {
    try {
      const user_id = user._id;
      return new ResponData<string>(
        await this.roomTypeService.deleteRoomType(id, user_id),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData(null, HttpStatus.ERROR, `Lỗi: ${error.message}`);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateRoomType(
    @Param('id') id: string,
    @Body() updateRoomTypeDto: UpdateRoomTypeDto,
    @GetUser()
    user: any,
  ) {
    try {
      const user_id = user._id;
      const updateRoomType = await this.roomTypeService.updateRoomType(
        Number(id),
        updateRoomTypeDto,
        user_id,
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

  @UseGuards(JwtAuthGuard)
  @Get('/findAllRoomType')
  async findAllRoomTypesWithRooms(
    @GetUser()
    user: any,
  ) {
    try {
      const user_id = user._id;
      const resultRoomType =
        await this.roomTypeService.findAllRoomTypesWithRooms(user_id);
      return new ResponData(
        resultRoomType,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData(null, HttpStatus.ERROR, `Lỗi: ${error.message}`);
    }
  }

  @UseGuards(JwtAuthGuard) // Đảm bảo người dùng đã được xác thực
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body('status') status: RoomTypeStatus,
    @GetUser()
    user: any, // Lấy thông tin người dùng từ request
  ) {
    try {
      const user_id = user._id;
      const resultRoomType = await this.roomTypeService.updateRoomTypeStatus(
        id,
        status,
        user_id,
      );
      return new ResponData(
        resultRoomType,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData(null, HttpStatus.ERROR, `Lỗi: ${error.message}`);
    }
  }

  @UseGuards(JwtAuthGuard) // Bảo vệ bằng JWT
  @Get('/getone/:id')
  async getRoomType(
    @Param('id') id: number, // Xác thực ID bằng DTO
    @GetUser() user: any, // Lấy thông tin người dùng từ JWT
  ): Promise<any> {
    try {
      const user_id = user._id;

      const roomType = await this.roomTypeService.getRoomTypeById(id, user_id);
      return new ResponData(roomType, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponData(null, HttpStatus.ERROR, `Lỗi: ${error.message}`);
    }
  }
}
