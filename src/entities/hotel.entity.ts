import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('hotel')
export class HotelEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    phone: string;

    @Column()
    email: string;
}