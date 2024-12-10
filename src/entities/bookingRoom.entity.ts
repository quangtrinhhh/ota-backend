import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoomEntity } from './room.entity';
import { BookingEntity } from './booking.entity';
import { HotelEntity } from './hotel.entity';

@Entity('booking_room')
export class BookingRoomEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @ManyToOne(() => BookingEntity, (booking) => booking.id)
  @JoinColumn({ name: 'booking_id' })
  booking: BookingEntity;

  @Column()
  booking_id: number;

  @Column({
    type: 'enum',
    enum: ['hourly_rate', 'daily_rate', 'overnight_rate'],
    default: 'daily_rate', // Trạng thái mặc định là gái ngày
  })
  price_type: 'hourly_rate' | 'daily_rate' | 'overnight_rate';

  @ManyToOne(() => RoomEntity, (room) => room.id)
  @JoinColumn({ name: 'room_id' })
  room: RoomEntity;

  @Column()
  room_id: number;

  @ManyToOne(() => HotelEntity, (hotel) => hotel.id)
  @JoinColumn({ name: 'hotel_id' })
  hotel: HotelEntity;

  @Column()
  hotel_id: number;
}
