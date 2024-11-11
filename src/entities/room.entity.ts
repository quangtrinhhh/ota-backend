import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoomTypeEntity } from "./roomType.entity";

@Entity('room')
export class RoomEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    clean_status: boolean;

    @Column()
    status: string;

    @Column()
    price: number;

    @ManyToOne(() => RoomTypeEntity, roomType => roomType.id)
    @JoinColumn({ name: 'room_type_id' })
    room_type: RoomTypeEntity;

    @Column()
    room_type_id: number;
}