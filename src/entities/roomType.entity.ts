import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { HotelEntity } from "./hotel.entity";

@Entity('room_type')
export class RoomTypeEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    notes: string;

    @ManyToOne(() => HotelEntity, hotel => hotel.id)
    @JoinColumn({ name: 'hotel_id' })
    hotel: number;

    @Column()
    hotel_id: number;
}