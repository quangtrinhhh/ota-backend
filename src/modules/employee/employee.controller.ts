import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from "@nestjs/common";
import { ResponData } from "src/global/globalClass";
import { HttpMessage, HttpStatus } from "src/global/globalEnum";
import { EmployeeService } from "./employee.service";
import { Customer } from "src/models/customer.model";
import { Employee } from "src/models/employee.model";
import { CreateEmployeeDto } from "./dto/createEmployee.dto";
import { UpdateEmployeeDto } from "./dto/updateEmployee.dto";

@Controller('employees')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) { }

    @Get(':hotel_id')
    async getEmployeesByHotelId(@Param('hotel_id') hotel_id: number): Promise<ResponData<Employee[]>> {
        try {
            return new ResponData<Employee[]>(
                await this.employeeService.getEmployeesByHotelId(hotel_id),
                HttpStatus.SUCCESS,
                HttpMessage.SUCCESS,
            );
        } catch (error) {
            if (error.message) {
                return new ResponData<Employee[]>(null, HttpStatus.ERROR, error.message);
            }
            return new ResponData<Employee[]>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Post()
    async createEmployees(@Body(ValidationPipe) createEmployees: CreateEmployeeDto[]): Promise<ResponData<any[]>> {
        try {
            return new ResponData<any[]>(
                await this.employeeService.createEmployees(createEmployees),
                HttpStatus.SUCCESS,
                HttpMessage.SUCCESS,
            );
        } catch (error) {
            if (error.message) {
                return new ResponData<any[]>(null, HttpStatus.ERROR, error.message);
            }
            return new ResponData<any[]>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Put('updateStatus/:id')
    async updateStatusEmployee(@Param('id') id: number): Promise<ResponData<any>> {
        try {
            return new ResponData<any>(
                await this.employeeService.updateStatusEmployee(id),
                HttpStatus.SUCCESS,
                HttpMessage.SUCCESS,
            );
        } catch (error) {
            if (error.message) {
                return new ResponData<any>(null, HttpStatus.ERROR, error.message);
            }
            return new ResponData<any>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Put()
    async updateEmployee(@Body(ValidationPipe) updateEmployee: UpdateEmployeeDto): Promise<ResponData<Employee>> {
        try {
            return new ResponData<Employee>(
                await this.employeeService.updateEmployee(updateEmployee),
                HttpStatus.SUCCESS,
                HttpMessage.SUCCESS,
            );
        } catch (error) {
            if (error.message) {
                return new ResponData<Employee>(null, HttpStatus.ERROR, error.message);
            }
            return new ResponData<Employee>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Delete(':id')
    async deleteEmployees(@Param('id') id: number): Promise<ResponData<string>> {
        try {
            return new ResponData<string>(
                await this.employeeService.deleteEmployees(id),
                HttpStatus.SUCCESS,
                HttpMessage.SUCCESS,
            );
        } catch (error) {
            if (error.message) {
                return new ResponData<string>(null, HttpStatus.ERROR, error.message);
            }
            return new ResponData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }
}
