import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('customer')
export class CustomerEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    name: string;

    @Column({ type: 'date' })
    birthday: string;

    @Column()
    phone: string;

    @Column()
    email: string;

    @Column({
        type: 'enum',
        enum: ['Male', 'Female', 'Other'],
        default: 'Male', // Giới tính mặc định là Male
    })
    gender: 'Male' | 'Female' | 'Other';
}