import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { HotelEntity } from './hotel.entity';
import { RoomEntity } from './room.entity';

export enum RoomTypeStatus {
  ACTIVE = 'ACTIVE', // Phòng đang hoạt động
  INACTIVE = 'INACTIVE', // Phòng không hoạt động
  UNDER_MAINTENANCE = 'UNDER_MAINTENANCE', // Phòng đang bảo trì (tùy chọn)
}
@Entity('room_type')
export class RoomTypeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Cột code với tính năng tự động tạo khi người dùng không nhập vào
  @Column({ type: 'varchar', length: 50, nullable: true, unique: true })
  code: string; // Mã phòng, có thể tùy chọn và có độ dài tối đa là 50 ký tự

  @Column()
  name: string;

  @Column()
  notes: string;

  @Column({ type: 'float', nullable: true })
  hourlyRate: number; // Giá thuê theo giờ

  @Column({ type: 'float', nullable: true })
  dailyRate: number; // Giá thuê theo ngày

  @Column({ type: 'float', nullable: true })
  overnightRate: number; // Giá thuê qua đêm

  @Column({ type: 'int', default: 0 })
  standardCapacity: number; // Sức chứa tiêu chuẩn (người lớn)

  @Column({ type: 'int', default: 0 })
  standardChildren: number; // Sức chứa tiêu chuẩn (trẻ em)

  @Column({ type: 'int', default: 0 })
  maxCapacity: number; // Sức chứa tối đa (người lớn)

  @Column({ type: 'int', default: 0 })
  maxChildren: number; // Sức chứa tối đa (trẻ em)

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date; // Ngày giờ tạo phiếu

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date; // Ngày giờ cập nhật

  @ManyToOne(() => HotelEntity, (hotel) => hotel.id)
  @JoinColumn({ name: 'hotel_id' })
  hotel: HotelEntity;

  @Column()
  hotel_id: number;

  @Column({
    type: 'enum',
    enum: RoomTypeStatus,
    default: RoomTypeStatus.ACTIVE, // Mặc định là phòng đang hoạt động
  })
  status: RoomTypeStatus; // Trạng thái phòng
  @OneToMany(() => RoomEntity, (room) => room.room_type)
  rooms: RoomEntity[];
}
