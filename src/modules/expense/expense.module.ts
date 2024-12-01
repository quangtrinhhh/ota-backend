import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExpenseController } from "./expense.controller";
import { ExpenseService } from "./expense.service";
import { ExpenseEntity } from "src/entities/expense.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ExpenseEntity])],
    controllers: [ExpenseController],
    providers: [ExpenseService],
    exports: [ExpenseService],
})
export class ExpenseModule { }