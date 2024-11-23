import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateExpenseDto } from "./dto/createExpense.dto";
import { UpdateExpenseDto } from "./dto/updateExpense.dto";
import { ExpenseEntity } from "src/entities/expense.entity";
import { Expense } from "src/models/expense.model";

@Injectable()
export class ExpenseService {
    constructor(
        @InjectRepository(ExpenseEntity)
        private readonly expenseRepository: Repository<ExpenseEntity>
    ) { }

    async getExpenses(): Promise<Expense[]> {
        const expenses = await this.expenseRepository.find();
        return expenses.map(
            expense => new Expense(expense.id, expense.code, expense.amount, expense.payment_method, expense.note, expense.customer_name, expense.created_by, expense.hotel_id, expense.category, expense.invoice_id));
    }

    async findOneExpense(id: number): Promise<Expense> {
        const expense = await this.expenseRepository.findOne({ where: { id } });
        return new Expense(expense.id, expense.code, expense.amount, expense.payment_method, expense.note, expense.customer_name, expense.created_by, expense.hotel_id, expense.category, expense.invoice_id);
    }

    async createExpense(createExpenseDto: CreateExpenseDto): Promise<Expense> {
        const expense = new Expense();
        expense.code = createExpenseDto.code;
        expense.amount = createExpenseDto.amount;
        expense.payment_method = createExpenseDto.payment_method;
        expense.note = createExpenseDto.note;
        expense.customer_name = createExpenseDto.customer_name;
        expense.created_by = createExpenseDto.created_by;
        expense.hotel_id = createExpenseDto.hotel_id;
        expense.category = createExpenseDto.category;
        expense.invoice_id = createExpenseDto.invoice_id;

        await this.expenseRepository.save(expense);
        return new Expense(expense.id, expense.code, expense.amount, expense.payment_method, expense.note, expense.customer_name, expense.created_by, expense.hotel_id, expense.category, expense.invoice_id);
    }

    async updateExpense(updateExpenseDto: UpdateExpenseDto): Promise<Expense> {
        const { id, ...updateExpenseData } = updateExpenseDto;

        await this.expenseRepository.update(id, updateExpenseData);

        const expense = await this.expenseRepository.findOne({ where: { id } })
        return new Expense(expense.id, expense.code, expense.amount, expense.payment_method, expense.note, expense.customer_name, expense.created_by, expense.hotel_id, expense.category, expense.invoice_id);
    }

    async deleteExpense(id: number): Promise<string> {
        await this.expenseRepository.delete(id);
        return `Delete expense ${id} success`;
    }
}