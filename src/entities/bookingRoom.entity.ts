import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoomEntity } from "./room.entity";
import { BookingEntity } from "./booking.entity";

@Entity('booking_room')
export class BookingRoomEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    price: number;

    @ManyToOne(() => BookingEntity, booking => booking.id)
    @JoinColumn({ name: 'booking_id' })
    booking: BookingEntity;

    @Column()
    booking_id: number;

    @ManyToOne(() => RoomEntity, room => room.id)
    @JoinColumn({ name: 'room_id' })
    room: RoomEntity;

    @Column()
    room_id: number;
}
