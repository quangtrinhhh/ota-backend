import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from "@nestjs/common";
import { HttpMessage, HttpStatus } from "src/global/globalEnum";
import { ResponData } from "src/global/globalClass";
import { CreateExpenseDto } from "./dto/createExpense.dto";
import { UpdateExpenseDto } from "./dto/updateExpense.dto";
import { Expense } from "src/models/expense.model";
import { ExpenseService } from "./expense.service";
@Controller('expense')
export class ExpenseController {
    constructor(private readonly expenseService: ExpenseService) { }

    @Get()
    async getExpenses(): Promise<ResponData<Expense[]>> {
        try {
            return new ResponData<Expense[]>(await this.expenseService.getExpenses(), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData<Expense[]>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Get(':id')
    async findOneExpense(@Param('id') id: number): Promise<ResponData<Expense>> {
        try {
            return new ResponData<Expense>(await this.expenseService.findOneExpense(id), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData<Expense>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Post()
    async createExpense(@Body(new ValidationPipe) createExpenseDto: CreateExpenseDto): Promise<ResponData<Expense>> {
        try {
            return new ResponData<Expense>(await this.expenseService.createExpense(createExpenseDto), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData<Expense>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Put()
    async updateExpense(@Body(new ValidationPipe) updateExpenseDto: UpdateExpenseDto): Promise<ResponData<Expense>> {
        try {
            return new ResponData<Expense>(await this.expenseService.updateExpense(updateExpenseDto), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData<Expense>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Delete(':id')
    async deleteExpense(@Param('id') id: number): Promise<ResponData<string>> {
        try {
            return new ResponData<string>(await this.expenseService.deleteExpense(id), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }
}