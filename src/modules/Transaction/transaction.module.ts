import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from 'src/entities/transaction.entity';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { BankTransactionEntity } from 'src/entities/bankTransaction.entity';
import { CashTransactionEntity } from 'src/entities/cashTransaction.entity';
import { UserEntity } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransactionEntity,
      BankTransactionEntity,
      CashTransactionEntity,
      UserEntity,
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
