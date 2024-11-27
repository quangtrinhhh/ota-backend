import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FloorEntity } from 'src/entities/floor.entity';
import { Repository } from 'typeorm';
import { CreateFloorDto } from './dto/CreateFloor.dto';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class FloorService {
  constructor(
    @InjectRepository(FloorEntity)
    private floorRepository: Repository<FloorEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createFloor(dto: CreateFloorDto, user_id: number) {
    try {
      // Lấy hotelId dựa trên user_id
      const hotelId = await this.getHotelIdByUser(user_id);

      if (!hotelId) {
        throw new Error('Không tìm thấy hotel_id cho user này');
      }
      // Kiểm tra nếu tên tầng đã tồn tại trong khách sạn này
      const existingFloor = await this.floorRepository.findOne({
        where: { name: dto.name, hotel_id: hotelId },
      });

      if (existingFloor) {
        throw new BadRequestException(
          `Tên ${dto.name} đã tồn tại trong khách sạn này`,
        );
      }

      // Tạo đối tượng FloorEntity mới
      const newFloor = await this.floorRepository.create({
        ...dto,
        hotel_id: hotelId,
        level: dto.floor_id,
      });

      // Lưu đối tượng vào cơ sở dữ liệu
      await this.floorRepository.save(newFloor);

      return newFloor; // Trả về tầng mới đã được lưu
    } catch (error) {
      throw error;
    }
  }

  async getAllFloor(user_id: number) {
    try {
      // Lấy hotelId dựa trên user_id
      const hotelId = await this.getHotelIdByUser(user_id);
      if (!hotelId) {
        throw new Error('Người dùng này không thuộc khách sạn nào.');
      }

      // Lấy danh sách tất cả các tầng thuộc hotel_id
      const floors = await this.floorRepository.find({
        where: { hotel_id: hotelId },
      });

      // Nếu không có tầng nào, trả về thông báo phù hợp
      if (!floors || floors.length === 0) {
        throw new Error(
          `Không tìm thấy tầng nào thuộc khách sạn có ID ${hotelId}`,
        );
      }
      return floors;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param userId
   * @returns
   */
  async getHotelIdByUser(userId: number): Promise<number> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) throw new Error('User not found');
    return user.hotel_id;
  }
}
