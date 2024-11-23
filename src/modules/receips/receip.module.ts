import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReceiptController } from "./receip.controller";
import { ReceiptService } from "./receip.service";
import { ReceiptEntity } from "src/entities/receipt.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ReceiptEntity])],
    controllers: [ReceiptController],
    providers: [ReceiptService],
    exports: [ReceiptService],
})
export class ReceiptModule { }