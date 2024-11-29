import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { FloorService } from './floor.service';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';
import { CreateFloorDto } from './dto/CreateFloor.dto';
import { GetUser } from 'src/decorator/user.decorator';
import { ResponData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { UpdateFloorDto } from './dto/UpdateFloor.dto';

@Controller('floor')
export class FloorController {
  constructor(private readonly FloorService: FloorService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createFloor(
    @Body(new ValidationPipe()) dto: CreateFloorDto,
    @GetUser()
    user: any,
  ) {
    try {
      const user_id = user._id;
      const createNewFloor = await this.FloorService.createFloor(dto, user_id);
      return new ResponData(
        createNewFloor,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData(null, HttpStatus.ERROR, `Lỗi: ${error.message}`);
    }
  }

  @Get('/all')
  @UseGuards(JwtAuthGuard)
  async getAllFloor(
    @GetUser()
    user: any,
  ) {
    try {
      const user_id = user._id;
      const getAllFloor = await this.FloorService.getAllFloor(user_id);
      return new ResponData(
        getAllFloor,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData(null, HttpStatus.ERROR, `Lỗi: ${error.message}`);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOneById(
    @GetUser()
    user: any,
    @Param('id') id: number,
  ) {
    try {
      const user_id = user._id;
      const getAllFloor = await this.FloorService.getFloorById(id, user_id);
      return new ResponData(
        getAllFloor,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData(null, HttpStatus.ERROR, `Lỗi: ${error.message}`);
    }
  }
  // Xóa floor theo ID
  @Delete(':id')
  async deleteFloor(@Param('id') id: number): Promise<any> {
    try {
      const deleteFloor = await this.FloorService.deleteFloor(id);
      return new ResponData(
        deleteFloor,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData(null, HttpStatus.ERROR, `Lỗi: ${error.message}`);
    }
  }

  // Cập nhật thông tin floor
  @Put(':id')
  async updateFloor(
    @Param('id') id: number,
    @Body() updateFloorDto: UpdateFloorDto,
  ): Promise<any> {
    try {
      const deleteFloor = await this.FloorService.updateFloor(
        Number(id),
        updateFloorDto,
      );
      return new ResponData(
        deleteFloor,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData(null, HttpStatus.ERROR, `Lỗi: ${error.message}`);
    }
  }
}
