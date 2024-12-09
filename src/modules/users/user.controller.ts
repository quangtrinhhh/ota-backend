import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ResponData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { UserService } from './user.service';
import { User } from 'src/models/user.model';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';
import { GetUser } from 'src/decorator/user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async getUsers(): Promise<ResponData<User[]>> {
    try {
      const users = await this.userService.getUsers();
      return new ResponData<User[]>(
        users,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<User[]>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get('getUsersByHotelIdNotRoleAdmin')
  async getUsersByHotelIdNotRoleAdmin(
    @Query('hotel_id') hotel_id: number,
    @Query('currentPage') currentPage: number,
    @Query('pageSize') pageSize: number,
  ) {
    try {
      const result = await this.userService.getUsersByHotelIdNotRoleAdmin(
        hotel_id,
        currentPage,
        pageSize,
      );
      return new ResponData<any>(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponData(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get(':id')
  async getDetailUser(@Param('id') id: number): Promise<ResponData<User>> {
    try {
      const user = await this.userService.getDetailUser(id);

      return new ResponData<User>(
        user,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<User>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Post()
  async createUser(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<ResponData<User>> {
    try {
      const user = await this.userService.createUser(createUserDto);
      return new ResponData<User>(
        user,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      if (error.message) {
        return new ResponData<User>(null, HttpStatus.ERROR, error.message);
      }
      return new ResponData<User>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Put()
  async updateUser(
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ): Promise<ResponData<string>> {
    try {
      return new ResponData<string>(
        await this.userService.updateUser(updateUserDto),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      if (error.message) {
        return new ResponData<string>(null, HttpStatus.ERROR, error.message);
      }
      return new ResponData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Delete('/deleteUsers')
  async deleteUsers(@Body() body: any): Promise<ResponData<string>> {
    try {
      const ids = body?.id;
      console.log("id", ids);

      return new ResponData<string>(
        await this.userService.deleteUsers(ids),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<ResponData<string>> {
    try {
      return new ResponData<string>(
        await this.userService.deleteUser(id),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/userbyhotel/all')
  async getIdbyHotel(@GetUser() user: any): Promise<any> {
    const userId = user._id; // Lấy id người dùng từ JWT
    try {
      const result = await this.userService.getUsersByHotelId(userId);
      return new ResponData(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      console.error(error); // Log lỗi để tiện theo dõi
      return new ResponData(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Put('updateStatus/:id')
  async updateStatus(
    @Param('id') id: number,
  ): Promise<ResponData<string>> {
    try {
      return new ResponData<string>(
        await this.userService.updateStatus(id),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      if (error.message) {
        return new ResponData<string>(null, HttpStatus.ERROR, error.message);
      }
      return new ResponData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
