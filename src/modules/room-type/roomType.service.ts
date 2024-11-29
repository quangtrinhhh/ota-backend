import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomTypeEntity, RoomTypeStatus } from 'src/entities/roomType.entity';
import { Repository } from 'typeorm';
import { CreateRoomTypeDto } from './dto/createroomtype.dto';
import { UpdateRoomTypeDto } from './dto/updateRoomType.dto';
import { UserEntity } from 'src/entities/user.entity';
import { RoomEntity } from 'src/entities/room.entity';
import { FloorEntity } from 'src/entities/floor.entity';

@Injectable()
export class RoomTypeService {
  constructor(
    @InjectRepository(RoomTypeEntity)
    private roomTypeRepository: Repository<RoomTypeEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    @InjectRepository(FloorEntity)
    private readonly floorEntityRepository: Repository<FloorEntity>,
  ) {}

  //Tạo mới
  async createRoomType(dto: CreateRoomTypeDto, user_id: number): Promise<any> {
    try {
      // Lấy hotel_id từ user
      const hotelId = await this.getHotelIdByUser(user_id); // Giả sử getHotelIdByUser trả về hotel_id của user

      // Kiểm tra nếu không tìm thấy hotel_id
      if (!hotelId) {
        throw new Error('Không tìm thấy hotel_id cho user này');
      }

      if (
        dto.maxCapacity < dto.standardCapacity ||
        dto.maxChildren < dto.standardChildren
      ) {
        throw new Error(
          'Sức chứa tiêu chuẩn phải nhỏ hơn hoặc bằng sức chứa tối đa',
        );
      }

      // Kiểm tra nếu code không được nhập, tự động tạo code
      let code = dto.code;
      if (!code) {
        code = await this.generateUniqueCode(hotelId);
      } else {
        // Kiểm tra nếu code đã tồn tại trong cùng khách sạn
        const existingRoomType = await this.roomTypeRepository.findOne({
          where: { hotel_id: hotelId, code },
        });
        if (existingRoomType) {
          throw new ConflictException(
            'Mã phòng đã tồn tại trong khách sạn này vui lòng tạo mã khác hoặc để trống mã tự tạo.',
          );
        }
      }

      // Tạo mới phòng
      const newRoomType = this.roomTypeRepository.create({
        ...dto,
        hotel_id: hotelId,
        code,
      });

      // Lưu phòng mới vào cơ sở dữ liệu
      const savedRoomType = await this.roomTypeRepository.save(newRoomType);

      return savedRoomType.code;
    } catch (error) {
      throw error;
    }
  }
  // lấy tất cả
  async findAllRoomType(user_id: number): Promise<any> {
    try {
      // Kiểm tra khách sạn của người dùng
      const user = await this.userRepository.findOne({
        where: { id: user_id },
        relations: ['hotel'],
      });

      if (!user || !user.hotel) {
        throw new ForbiddenException(
          'Người dùng không có quyền truy cập vào dữ liệu này',
        );
      }

      // Lấy tất cả phòng của khách sạn người dùng thuộc về
      const roomTypes = await this.roomTypeRepository.find({
        where: { hotel_id: user.hotel_id },
      });

      if (roomTypes.length === 0) {
        throw new ForbiddenException(
          'Không có loại phòng nào thuộc khách sạn này',
        );
      }

      return roomTypes;
    } catch (error) {
      throw error;
    }
  }
  // Xóa loại phòng
  async deleteRoomType(id: number, user_id: number): Promise<string> {
    // Kiểm tra khách sạn của người dùng
    const user = await this.userRepository.findOne({
      where: { id: user_id },
      relations: ['hotel'],
    });

    if (!user || !user.hotel) {
      throw new ForbiddenException(
        'Người dùng không có quyền truy cập vào dữ liệu này',
      );
    }

    // Kiểm tra xem loại phòng có tồn tại hay không
    const roomType = await this.roomTypeRepository.findOne({
      where: { id, hotel_id: user.hotel_id },
    });

    if (!roomType) {
      throw new NotFoundException(
        `Không tìm thấy loại phòng với id ${id} thuộc khách sạn của bạn.`,
      );
    }

    // Kiểm tra xem có phòng nào đang sử dụng loại phòng này không
    const roomsUsingThisType = await this.roomRepository.find({
      where: { room_type_id: id, hotel_id: user.hotel_id },
      relations: ['room_type'], // Giả sử bạn có quan hệ giữa phòng và loại phòng
    });

    if (roomsUsingThisType.length > 0) {
      // Lấy danh sách tên phòng đang sử dụng loại phòng này
      const roomNames = roomsUsingThisType.map((room) => room.name).join(', ');

      throw new ConflictException(
        `Vui lòng xử lý các phòng ${roomNames} này trước khi xóa loại phòng.`,
      );
    }

    // Thực hiện xóa loại phòng
    await this.roomTypeRepository.delete(id);

    return `Xóa loại phòng với id ${id} thành công.`;
  }

  // sửa
  async updateRoomType(
    id: number,
    updateRoomTypeDto: UpdateRoomTypeDto,
    user_id: number,
  ): Promise<UpdateRoomTypeDto> {
    const roomType = await this.roomTypeRepository.findOne({
      where: { id },
      relations: ['hotel'],
    });

    if (!roomType) {
      throw new NotFoundException(`RoomType với id ${id} không tồn tại.`);
    }

    if (
      updateRoomTypeDto.maxCapacity < updateRoomTypeDto.standardCapacity ||
      updateRoomTypeDto.maxChildren < updateRoomTypeDto.standardChildren
    ) {
      throw new Error(
        'Sức chứa tiêu chuẩn phải nhỏ hơn hoặc bằng sức chứa tối đa',
      );
    }
    // Kiểm tra quyền người dùng (user_id) có phải là nhân viên của khách sạn không
    const user = await this.userRepository.findOne({
      where: { id: user_id },
      relations: ['hotel'],
    }); // Tìm thông tin người dùng với khách sạn
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại.');
    }
    // Kiểm tra xem user_id có phải là nhân viên của khách sạn không
    if (user.hotel_id !== roomType.hotel_id) {
      throw new UnauthorizedException('Bạn không có quyền cập nhật phòng này.');
    }

    Object.assign(roomType, updateRoomTypeDto);
    // Cập nhật thời gian `updatedAt` (nếu có)
    roomType.updated_at = new Date();
    return this.roomTypeRepository.save(roomType);
  }
  //

  async findAllRoomTypesWithRooms(user_id: number): Promise<any[]> {
    try {
      // Xác định khách sạn của người dùng
      const hotelId = await this.getHotelIdByUser(user_id);

      if (!hotelId) {
        throw new UnauthorizedException(
          'Người dùng không thuộc khách sạn nào.',
        );
      }

      // Lấy tất cả RoomType liên quan đến khách sạn, bao gồm Room và Floor
      const roomTypes = await this.roomTypeRepository.find({
        where: { hotel_id: hotelId },
        relations: ['rooms', 'rooms.floor'], // Liên kết với Room và Floor
      });

      if (!roomTypes.length) {
        throw new NotFoundException('Không tìm thấy loại phòng nào.');
      }

      // Xử lý dữ liệu trả về
      const result = roomTypes.map((roomType) => ({
        roomTypeId: roomType.id,
        roomTypeCode: roomType.code,
        roomTypeName: roomType.name,
        notes: roomType.notes,
        hourlyRate: roomType.hourlyRate,
        dailyRate: roomType.dailyRate,
        overnightRate: roomType.overnightRate,
        standardCapacity: roomType.standardCapacity,
        standardChildren: roomType.standardChildren,
        maxCapacity: roomType.maxCapacity,
        maxChildren: roomType.maxChildren,
        status: roomType.status,
        created_at: roomType.created_at,
        totalRooms: roomType.rooms.filter((room) => room.hotel_id === hotelId)
          .length, // Đảm bảo phòng thuộc khách sạn
        rooms: roomType.rooms
          .filter((room) => room.hotel_id === hotelId) // Chỉ lấy phòng thuộc khách sạn
          .map((room) => ({
            roomId: room.id,
            roomName: room.name,
            floorName: room.floor?.name || 'Unknown Floor', // Xử lý nếu floor bị null
            status: room.status,
            cleanStatus: room.clean_status,
            price: room.price,
          })),
      }));

      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'Không thể lấy dữ liệu loại phòng. Vui lòng thử lại sau.',
      );
    }
  }
  //update trạng thái

  async updateRoomTypeStatus(
    id: number,
    newStatus: RoomTypeStatus,
    userId: number,
  ): Promise<RoomTypeEntity> {
    // Kiểm tra nếu status không hợp lệ (có thể bỏ qua vì đã kiểm tra trong Controller)
    if (!Object.values(RoomTypeStatus).includes(newStatus)) {
      throw new BadRequestException(
        'Invalid status value. Allowed values: ACTIVE, INACTIVE, UNDER_MAINTENANCE',
      );
    }
    // Tìm phòng theo ID
    const roomType = await this.roomTypeRepository.findOne({
      where: { id },
      relations: ['hotel'], // Đảm bảo rằng bạn truyền `relations` trong options
    });

    if (!roomType) {
      throw new NotFoundException('Room type not found');
    }

    // Tìm người dùng hiện tại
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Kiểm tra xem người dùng có phải là quản lý của khách sạn không
    if (user.hotel_id !== roomType.hotel_id) {
      throw new ForbiddenException(
        'You do not have permission to update this room type status',
      );
    }

    // Cập nhật trạng thái phòng
    roomType.status = newStatus;

    // Lưu thay đổi và trả về đối tượng đã được cập nhật
    return this.roomTypeRepository.save(roomType); // Trả về RoomTypeEntity sau khi lưu
  }
  // Lấy ra 1

  async getRoomTypeById(id: number, userId: number): Promise<RoomTypeEntity> {
    const roomType = await this.roomTypeRepository.findOne({
      where: { id },
      relations: ['hotel'], // Load thông tin khách sạn
    });

    if (!roomType) {
      throw new NotFoundException(`RoomType with ID ${id} not found`);
    }

    // Kiểm tra quyền truy cập
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new ForbiddenException('User not found or unauthorized');
    }

    if (user.hotel_id !== roomType.hotel.id) {
      throw new ForbiddenException(
        'You do not have permission to access this RoomType',
      );
    }

    return roomType;
  }
  // -------------------------------------------------------------------------------------
  /**
   * Lấy ID khách sạn của người dùng
   */
  async getHotelIdByUser(userId: number): Promise<number> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) throw new Error('User not found');
    return user.hotel_id;
  }
  // Hàm tạo mã phòng duy nhất cho khách sạn
  private async generateUniqueCode(hotelId: number): Promise<string> {
    let code: string;
    let isUnique = false;

    // Vòng lặp tạo mã phòng cho đến khi mã này duy nhất trong khách sạn
    while (!isUnique) {
      code =
        'HP' +
        hotelId +
        Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, '0');
      const existingRoomType = await this.roomTypeRepository.findOne({
        where: { hotel_id: hotelId, code },
      });
      if (!existingRoomType) {
        isUnique = true;
      }
    }

    return code;
  }
}
