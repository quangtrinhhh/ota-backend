import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BookingEntity } from "./booking.entity";

@Entity('invoice')
export class InvoiceEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'timestamp' }) // Tự động lấy thời gian tạo bản ghi
    issue_at: Date;

    @Column()
    total_amount: number;

    @Column({
        type: 'enum',
        enum: ['Cash', 'Credit_card', 'Bank_transfer'],
        default: 'Cash', // Giá trị mặc định là 'Cash'
    })
    payment_method: 'Cash' | 'Credit_card' | 'Bank_transfer';

    @Column({
        type: 'enum',
        enum: ['Paid', 'Unpaid'],
        default: 'Unpaid', // Giá trị mặc định là 'Unpaid'
    })
    status: 'Paid' | 'Unpaid';

    @ManyToOne(() => BookingEntity, booking => booking.id)
    @JoinColumn({ name: 'booking_id' })
    booking: BookingEntity;

    @Column()
    booking_id: number;
}