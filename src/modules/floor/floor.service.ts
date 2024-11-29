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
import { UpdateFloorDto } from './dto/UpdateFloor.dto';
import { RoomEntity } from 'src/entities/room.entity';

@Injectable()
export class FloorService {
  constructor(
    @InjectRepository(FloorEntity)
    private floorRepository: Repository<FloorEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoomEntity)
    private roomRepository: Repository<RoomEntity>,
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
  // Hàm lấy một floor theo ID
  async getFloorById(id: number, user_id: number): Promise<any> {
    const hotelId = await this.getHotelIdByUser(user_id);
    const floor = await this.floorRepository.findOne({
      where: { id, hotel_id: hotelId }, // Tìm floor theo ID
      relations: ['hotel'], // Nếu muốn lấy thông tin hotel liên quan, thêm quan hệ này
    });

    if (!floor) {
      throw new Error(`Floor with ID ${id} not found`);
    }

    return {
      id: floor.id,
      name: floor.name,
      floor_id: floor.level,
      note: floor.note,
    };
  }
  // Hàm update một floor
  async updateFloor(
    id: number,
    updateFloorDto: UpdateFloorDto,
  ): Promise<FloorEntity> {
    const floor = await this.floorRepository.findOne({ where: { id } });

    if (!floor) {
      throw new Error(`Floor with ID ${id} not found`);
    }

    // Cập nhật các trường còn lại từ updateFloorDto
    Object.assign(floor, updateFloorDto);

    // Kiểm tra giá trị hợp lệ của floor_id trước khi cập nhật level
    if (
      updateFloorDto.floor_id !== undefined &&
      !isNaN(updateFloorDto.floor_id)
    ) {
      floor.level = updateFloorDto.floor_id;
    } else {
      // Nếu floor_id không hợp lệ, có thể bỏ qua hoặc gán giá trị mặc định
      console.error('Invalid floor_id:', updateFloorDto.floor_id);
    }

    // Lưu lại đối tượng floor đã được cập nhật
    return this.floorRepository.save(floor);
  }

  // Hàm xóa một floor
  async deleteFloor(id: number): Promise<any> {
    const floor = await this.floorRepository.findOne({ where: { id } });
    // Kiểm tra xem có phòng nào còn liên kết với tầng không
    const rooms = await this.roomRepository.find({ where: { floor_id: id } });

    if (rooms.length > 0) {
      throw new Error(`Không thể xóa tầng vì còn phòng liên kết.`);
    }
    if (!floor) {
      throw new Error(`Floor with ID ${id} not found`);
    }

    await this.floorRepository.remove(floor); // Xóa floor

    return `Xóa thành công ${floor.name}`;
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
