import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InvoiceItemController } from "./invoiceItem.controller";
import { InvoiceItemService } from "./invoiceItem.service";
import { InvoiceItemEntity } from "src/entities/invoiceItems.entity";
import { ServiceModule } from "../services/service.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            InvoiceItemEntity
        ]),
        ServiceModule
    ],
    controllers: [InvoiceItemController],
    providers: [InvoiceItemService],
    exports: [InvoiceItemService],
})
export class InvoiceItemModule { }