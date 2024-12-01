import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InvoiceItemController } from "./invoiceItem.controller";
import { InvoiceItemService } from "./invoiceItem.service";
import { InvoiceItemEntity } from "src/entities/invoiceItems.entity";
import { ServiceModule } from "../services/service.module";
import { InvoiceModule } from "../invoice/invoice.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            InvoiceItemEntity
        ]),
        ServiceModule,
        forwardRef(() => InvoiceModule), 
    ],
    controllers: [InvoiceItemController],
    providers: [InvoiceItemService],
    exports: [InvoiceItemService],
})
export class InvoiceItemModule { }