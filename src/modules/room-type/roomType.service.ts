import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoomTypeEntity } from "src/entities/roomType.entity";
import { Repository } from "typeorm";
import { CreateRoomTypeDto } from "./dto/createroomtype.dto";
import { updateRoomTypeDto } from "./dto/updateRoomType.dto";

@Injectable()
export class RoomTypeService {
    constructor(
        @InjectRepository(RoomTypeEntity)
        private roomTypeRepository: Repository<RoomTypeEntity>,
      ) {}

    //Tạo mới
    async create(createRoomTypeDto: CreateRoomTypeDto):Promise<RoomTypeEntity>{
        const { name, notes, hotel_id } = createRoomTypeDto;
       const roomType = this.roomTypeRepository.create({
        name,
        notes,
        hotel_id,
       })
        return this.roomTypeRepository.save(roomType);
    }
    // lấy tất cả 
    async findAllService():Promise<RoomTypeEntity[]>{
        return await this.roomTypeRepository.find();
    }
    //Xóa
    async deleteRoomType(id: number):Promise<string>{
       await this.roomTypeRepository.delete(id);
       return `Delete user ${id} success`;
    }
    // sửa
    async updateRoomType(id: number, updateRoomTypeDto: updateRoomTypeDto): Promise<RoomTypeEntity> {
        const roomType = await this.roomTypeRepository.findOne({ where: { id } });
    
        if (!roomType) {
          throw new NotFoundException(`RoomType với id ${id} không tồn tại.`);
        }
    
        Object.assign(roomType, updateRoomTypeDto);
        return this.roomTypeRepository.save(roomType);
      }
}