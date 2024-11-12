import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { HotelEntity } from "./hotel.entity";

@Entity('role')
export class RoleEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToOne(() => HotelEntity, hotel => hotel.id)
    @JoinColumn({ name: 'hotel_id' })
    hotel: number;

    @Column()
    hotel_id: number;
}
