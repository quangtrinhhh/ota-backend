import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { UserEntity } from './user.entity'; // Import the User entity
import { HotelEntity } from './hotel.entity';

@Entity('employee') // Table name
export class EmployeeEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    code: string;

    @Column({ length: 100 })
    name: string; // Employee Name

    @Column({ type: 'date', nullable: true })
    birthDate?: Date; // Date of Birth

    @Column({ type: 'enum', enum: ['Male', 'Female', 'Other'], nullable: true })
    gender?: 'Male' | 'Female' | 'Other'; // Gender

    @Column({ length: 20, nullable: true })
    idCard?: string; // ID Card/Passport Number

    @Column({ length: 50, nullable: true })
    position?: string; // Job Position

    @Column({ type: 'date', nullable: true })
    startDate?: Date; // Start Date

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({ name: 'user_id' }) // Foreign key column name
    account: UserEntity; // User ID (linked to the User table)

    @Column({ nullable: true })
    user_id: number;

    @Column({ length: 15, nullable: true })
    phoneNumber?: string; // Phone Number

    @Column({ length: 100, nullable: true })
    email?: string; // Email Address

    @Column({ length: 100, nullable: true })
    facebook?: string; // Facebook Profile

    @Column({ type: 'text', nullable: true })
    address?: string; // Address

    @Column({ type: 'text', nullable: true })
    notes?: string; // Notes

    @Column({ type: 'text', nullable: true })
    img?: string; // Notes

    @Column({
        type: 'enum',
        enum: ['Working', 'Resigned'],
        default: 'Working',
    })
    status: 'Working' | 'Resigned'; // Employee Status

    @ManyToOne(() => HotelEntity, hotel => hotel.id)
    @JoinColumn({ name: 'hotel_id' })
    hotel: HotelEntity;

    @Column()
    hotel_id: number;
}
