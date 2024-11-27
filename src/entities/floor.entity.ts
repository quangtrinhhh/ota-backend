import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HotelEntity } from './hotel.entity';

@Entity('floor')
export class FloorEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Tên tầng (ví dụ: Tầng 1, Tầng 2, v.v.)

  @Column()
  level: number; // Mức độ của tầng (ví dụ: 1 cho tầng đầu tiên, 2 cho tầng thứ hai)

  @Column()
  note: string;

  @Column({ default: 0 })
  room_count: number; // Số lượng phòng trên tầng này

  @ManyToOne(() => HotelEntity, (hotel) => hotel.id)
  @JoinColumn({ name: 'hotel_id' })
  hotel: HotelEntity;

  @Column()
  hotel_id: number;
}
