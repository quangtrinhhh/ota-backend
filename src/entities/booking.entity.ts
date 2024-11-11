import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CustomerEntity } from "./customer.entity";

@Entity('booking')
export class BookingEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn({ type: 'timestamp' }) // Tự động lấy thời gian tạo bản ghi
    booking_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    check_in_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    check_out_at: Date;

    @Column()
    children: number;

    @Column()
    adults: number;

    @Column()
    total_amount: number;

    @Column({
        type: 'enum',
        enum: ['Booked', 'Cancelled'],
        default: 'Booked' // Trạng thái mặc định là đã đặt
    })
    status: 'Booked' | 'Cancelled';

    @ManyToOne(() => CustomerEntity, customer => customer.id)
    @JoinColumn({ name: 'customer_id' })
    customer: CustomerEntity;

    @Column()
    customer_id: number;
}