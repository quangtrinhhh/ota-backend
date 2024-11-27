import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoomTypeEntity } from './roomType.entity';
import { HotelEntity } from './hotel.entity';
import { FloorEntity } from './floor.entity';
import { BookingRoomEntity } from './bookingRoom.entity';

export enum RoomStatus {
  ACTIVE = 'ACTIVE', // Phòng đang hoạt động
  INACTIVE = 'INACTIVE', // Phòng không hoạt động
  UNDER_MAINTENANCE = 'UNDER_MAINTENANCE', // Phòng đang bảo trì (tùy chọn)
}
@Entity('room')
export class RoomEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  clean_status: boolean;

  @Column({
    type: 'enum',
    enum: RoomStatus,
    default: RoomStatus.ACTIVE, // Mặc định là phòng đang hoạt động
  })
  status: RoomStatus;

  @Column()
  price: number;

  @Column()
  notes: string;

  @Column({ type: 'timestamp' })
  start_date_use: Date;

  @ManyToOne(() => RoomTypeEntity, (roomType) => roomType.id)
  @JoinColumn({ name: 'room_type_id' })
  room_type: RoomTypeEntity;

  @Column()
  room_type_id: number;

  @ManyToOne(() => FloorEntity, (floor) => floor.id)
  @JoinColumn({ name: 'floor_id' })
  floor: FloorEntity;

  @Column()
  floor_id: number;

  @ManyToOne(() => HotelEntity, (hotel) => hotel.id)
  @JoinColumn({ name: 'hotel_id' })
  hotel: HotelEntity;

  @Column()
  hotel_id: number;

  @OneToMany(() => BookingRoomEntity, (bookingRoom) => bookingRoom.room)
  booking_rooms: BookingRoomEntity[];
}
