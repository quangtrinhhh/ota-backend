import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { HotelEntity } from "./hotel.entity";
import { ServiceEntity } from "./service.entity";

@Entity('categories')
export class CategoryEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @ManyToOne(() => HotelEntity, hotel => hotel.id)
    @JoinColumn({ name: 'hotel_id' })
    hotel: HotelEntity;

    @Column()
    hotel_id: number;

    @OneToMany(() => ServiceEntity, service => service.category)
    services: ServiceEntity[];
}
