import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Double,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HotelEntity } from './hotel.entity';
import { UserEntity } from './user.entity';
import { BankTransactionEntity } from './bankTransaction.entity';
import { CashTransactionEntity } from './cashTransaction.entity';

@Entity('transaction')
export class TransactionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string; // Mã số phiếu thu/chi (duy nhất)

  @Column({ type: 'varchar', length: 255 })
  content: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  note: string;

  @Column({ type: 'enum', enum: ['income', 'expense'] })
  transactionType: 'income' | 'expense'; // loại giao dịch

  @Column({ type: 'decimal', precision: 15 })
  amount: number;

  @Column({ type: 'enum', enum: ['cash', 'bank'] })
  paymentType: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ nullable: true })
  user_id: number;

  @Column({ type: 'boolean', default: false })
  isHandedOver: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date; // Ngày giờ tạo phiếu

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date; // Ngày giờ cập nhật

  // **Thêm mối quan hệ với bảng HotelEntity**
  @ManyToOne(() => HotelEntity, (hotel) => hotel.id)
  @JoinColumn({ name: 'hotel_id' })
  hotel: number;

  @Column()
  hotel_id: number;

  @OneToOne(
    () => BankTransactionEntity,
    (bankTransaction) => bankTransaction.transaction,
  )
  bankTransaction: BankTransactionEntity;

  @OneToOne(
    () => CashTransactionEntity,
    (cashTransaction) => cashTransaction.transaction,
  )
  cashTransaction: CashTransactionEntity;

  // **Trường status mới**
  @Column({
    type: 'enum',
    enum: ['active', 'cancelled'], // Trạng thái có thể là 'active' hoặc 'cancelled'
    default: 'active',
  })
  status: 'active' | 'cancelled'; // Mặc định là 'active'
}
