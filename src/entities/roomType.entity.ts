import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('room_type')
export class RoomTypeEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    notes: string;
}