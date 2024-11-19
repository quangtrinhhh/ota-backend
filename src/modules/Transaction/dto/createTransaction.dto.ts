import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
export enum PaymentType {
  CASH = 'cash',
  BANK = 'bank',
}
export class CreateTransactionDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  content: string; // Nội dung

  @IsOptional()
  @IsString()
  @MaxLength(255)
  note?: string; // Ghi chú

  @IsNotEmpty()
  @IsEnum(['income', 'expense'])
  transactionType: 'income' | 'expense'; // Loại giao dịch (thu/chi)

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  amount: number; // Số tiền

  @IsNotEmpty({ message: 'user id không đưuọc bỏ trống' })
  @Type(() => Number)
  @IsNumber()
  user_id: number; // Số tiền

  @IsString()
  @IsIn(['cash', 'bank'])
  paymentType: PaymentType;

  @IsOptional()
  @IsString()
  receiverAccount?: string; // (Chỉ dành cho chuyển khoản)

  @IsOptional()
  @IsString()
  receiverName?: string; // (Chỉ dành cho chuyển khoản)

  @IsOptional()
  @IsString()
  created_at?: Date; // (Chỉ dành cho chuyển khoản)
}
