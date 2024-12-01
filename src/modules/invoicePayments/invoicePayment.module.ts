import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InvoicePaymentController } from "./invoicePayment.controller";
import { InvoicePaymentService } from "./invoicePayment.service";
import { InvoicePaymentEntity } from "src/entities/invoicePayments.entity";
import { ReceiptModule } from "../receips/receip.module";
import { ExpenseModule } from "../expense/expense.module";
import { InvoiceModule } from "../invoice/invoice.module";
import { TransactionModule } from "../Transaction/transaction.module";
import { ReceiptEntity } from "src/entities/receipt.entity";
import { ExpenseEntity } from "src/entities/expense.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            InvoicePaymentEntity,
            ReceiptEntity,
            ExpenseEntity
        ]),
        ReceiptModule,
        ExpenseModule,
        InvoiceModule,
        TransactionModule,
    ],
    controllers: [InvoicePaymentController],
    providers: [InvoicePaymentService],
})
export class InvoicePaymentModule { }