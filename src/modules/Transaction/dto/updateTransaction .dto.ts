import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsString, IsEnum } from 'class-validator';

export class UpdateTransactionDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  paymentType?: 'cash' | 'bank';

  @IsOptional()
  @IsString()
  transactionType?: 'income' | 'expense';

  @IsOptional()
  @IsString()
  receiverAccount?: string;

  @IsOptional()
  @IsString()
  receiverName?: string;

  @IsOptional()
  @IsString()
  created_at?: Date;
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  user_id?: number;
}
