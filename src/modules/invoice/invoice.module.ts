import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { InvoiceEntity } from 'src/entities/invoice.entity';
import { ReceiptEntity } from 'src/entities/receipt.entity';
import { InvoiceItemEntity } from 'src/entities/invoiceItems.entity';
import { InvoiceItemModule } from '../invoiceItems/invoiceItem.module';
import { ReceiptModule } from '../receips/receip.module';
import { ServiceModule } from '../services/service.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([InvoiceEntity, ReceiptEntity]),
        InvoiceItemModule,
        ReceiptModule,
        ServiceModule,
    ],
    controllers: [InvoiceController],
    providers: [InvoiceService],
    exports: [InvoiceService],
})
export class InvoiceModule { }
