import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { FloorService } from './floor.service';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';
import { CreateFloorDto } from './dto/CreateFloor.dto';
import { GetUser } from 'src/decorator/user.decorator';
import { ResponData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';

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
}
