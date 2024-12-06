import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmployeeService } from "./employee.service";
import { EmployeeController } from './employee.controller';
import { EmployeeEntity } from "src/entities/employee.entity";

@Module({
    imports: [TypeOrmModule.forFeature([EmployeeEntity])],
    controllers: [EmployeeController],
    providers: [EmployeeService],
})
export class EmployeeModule { }