import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateInvoicePaymentDto } from "./dto/createInvoicePayment.dto";
import { UpdateInvoicePaymentDto } from "./dto/updateInvoicePayment.dto";
import { InvoicePaymentEntity } from "src/entities/invoicePayments.entity";
import { InvoicePayment } from "src/models/invoicePayment.model";
import { RequestTransactionDto } from "./dto/requestTransaction.dto";
import { ReceiptService } from "../receips/receip.service";
import { ExpenseService } from "../expense/expense.service";
import { v4 as uuidv4 } from 'uuid';
import { InvoiceService } from "../invoice/invoice.service";
import { CreateTransactionDto, PaymentType } from "../Transaction/dto/createTransaction.dto";
import { TransactionService } from "../Transaction/transaction.service";
import { PAYMENT_METHODS } from "src/constants/constants";
import { ReceiptEntity } from "src/entities/receipt.entity";
import { ExpenseEntity } from "src/entities/expense.entity";

const PAYMENT_OPTIONS = {
    REFUND: 'Hoàn tiền',
    PAYMENT: 'Thanh toán'
};

@Injectable()
export class InvoicePaymentService {
    constructor(
        @InjectRepository(InvoicePaymentEntity)
        private readonly invoicePaymentRepository: Repository<InvoicePaymentEntity>,

        @InjectRepository(ReceiptEntity)
        private readonly receiptRepository: Repository<ReceiptEntity>,

        @InjectRepository(ExpenseEntity)
        private readonly expenseRepository: Repository<ExpenseEntity>,

        private readonly receiptService: ReceiptService,
        private readonly expenseService: ExpenseService,
        private readonly invoiceService: InvoiceService,
        private readonly transactionService: TransactionService,
    ) { }

    async getInvoicePayments(): Promise<InvoicePayment[]> {
        const invoicePayments = await this.invoicePaymentRepository.find();
        return invoicePayments.map(invoicePayment => new InvoicePayment(invoicePayment.id, invoicePayment.payment_date, invoicePayment.amount, invoicePayment.payment_method, invoicePayment.note, invoicePayment.invoice_id));
    }

    async findOneInvoicePayment(id: number): Promise<InvoicePayment> {
        const invoicePayment = await this.invoicePaymentRepository.findOne({ where: { id } });
        return new InvoicePayment(invoicePayment.id, invoicePayment.payment_date, invoicePayment.amount, invoicePayment.payment_method, invoicePayment.note, invoicePayment.invoice_id);
    }

    async createInvoicePayment(createInvoicePaymentDto: CreateInvoicePaymentDto): Promise<InvoicePayment> {
        const invoicePayment = new InvoicePayment();
        invoicePayment.amount = createInvoicePaymentDto.amount;
        invoicePayment.payment_method = createInvoicePaymentDto.payment_method;
        invoicePayment.note = createInvoicePaymentDto.note;
        invoicePayment.invoice_id = createInvoicePaymentDto.invoice_id;

        await this.invoicePaymentRepository.save(invoicePayment);
        return new InvoicePayment(invoicePayment.id, invoicePayment.payment_date, invoicePayment.amount, invoicePayment.payment_method, invoicePayment.note, invoicePayment.invoice_id);
    }

    async updateInvoicePayment(updateInvoicePaymentDto: UpdateInvoicePaymentDto): Promise<InvoicePayment> {
        const { id, ...updateInvoicePaymentData } = updateInvoicePaymentDto;

        await this.invoicePaymentRepository.update(id, updateInvoicePaymentData);

        const invoicePayment = await this.invoicePaymentRepository.findOne({ where: { id } })
        return new InvoicePayment(invoicePayment.id, invoicePayment.payment_date, invoicePayment.amount, invoicePayment.payment_method, invoicePayment.note, invoicePayment.invoice_id);
    }

    async deleteInvoicePayment(id: number): Promise<string> {
        await this.invoicePaymentRepository.delete(id);
        return `Delete invoicePayment ${id} success`;
    }

    async handleTransaction(requestTransactionDto: RequestTransactionDto): Promise<any> {
        // thêm invoice payment
        const invoicePayment = new InvoicePayment();
        invoicePayment.amount = requestTransactionDto.price;
        invoicePayment.payment_method = requestTransactionDto.paymentMethod === PAYMENT_METHODS.CASH ? 'Cash' : 'Bank_transfer';
        invoicePayment.note = requestTransactionDto.note;
        invoicePayment.invoice_id = requestTransactionDto.invoice_id;

        await this.invoicePaymentRepository.save(invoicePayment);
        //

        // thêm phiếu thu hoặc chi
        let shortUuid = uuidv4().split('-')[0].slice(0, 5);
        if (requestTransactionDto.paymentOption === PAYMENT_OPTIONS.PAYMENT) {
            await this.receiptService.createReceipt({
                code: this.invoiceService.mapPaymentMethod(requestTransactionDto.paymentMethod) === PAYMENT_METHODS.CASH ? `PTTM-${shortUuid}` : `PTTG-${shortUuid}`,
                amount: requestTransactionDto.price,
                payment_method: requestTransactionDto.paymentMethod === PAYMENT_METHODS.CASH ? 'Cash' : 'Bank_transfer',
                note: requestTransactionDto.note,
                customer_name: '',
                user_id: requestTransactionDto.user_id,
                hotel_id: requestTransactionDto.hotel_id,
                category: 'Room_Payment',
                invoice_id: requestTransactionDto.invoice_id,
            });
        } else {
            await this.expenseService.createExpense({
                code: this.invoiceService.mapPaymentMethod(requestTransactionDto.paymentMethod) === PAYMENT_METHODS.CASH ? `PCTM-${shortUuid}` : `PCTG-${shortUuid}`,
                amount: requestTransactionDto.price,
                payment_method: requestTransactionDto.paymentMethod === PAYMENT_METHODS.CASH ? 'Cash' : 'Bank_transfer',
                note: requestTransactionDto.note,
                customer_name: '',
                user_id: requestTransactionDto.user_id,
                hotel_id: requestTransactionDto.hotel_id,
                category: 'Room_Payment',
                invoice_id: requestTransactionDto.invoice_id,
            });
        }
        //

        //Thêm bill
        const transactionDto: CreateTransactionDto = {
            content: requestTransactionDto.note ? requestTransactionDto.note : ` ${requestTransactionDto.paymentOption === PAYMENT_OPTIONS.PAYMENT ? 'Thu tiền' : 'Chi tiền'} từ phòng số hóa đơn #${requestTransactionDto.invoice_id}`, // Nội dung giao dịch
            note: requestTransactionDto.note,
            transactionType: requestTransactionDto.paymentOption === PAYMENT_OPTIONS.PAYMENT ? 'income' : 'expense',
            amount: requestTransactionDto.price,
            user_id: requestTransactionDto.user_id,
            paymentType:
                requestTransactionDto.paymentMethod === PAYMENT_METHODS.CASH ? PaymentType.CASH : PaymentType.BANK,
            created_at: new Date(),
        };

        await this.transactionService.createTransactionWithHotelId(
            transactionDto,
            requestTransactionDto.user_id,
            requestTransactionDto.hotel_id,
            transactionDto.transactionType,
            this.invoiceService.mapPaymentMethod(requestTransactionDto.paymentMethod) === 'Cash' ? `
            ${requestTransactionDto.paymentOption === PAYMENT_OPTIONS.PAYMENT ? 'PTTM' : 'PCTM'}-${shortUuid}` : `
            ${requestTransactionDto.paymentOption === PAYMENT_OPTIONS.PAYMENT ? 'PTTG' : 'PCTG'}-${shortUuid}`,
        );
        //

        return 'Add success';
    }

    async getAllReceiptAndExpenseByInvoiceId(invoice_id: number): Promise<any> {
        const receipts = await this.receiptRepository.find({ where: { invoice_id } });
        const expenses = await this.expenseRepository.find({ where: { invoice_id } });

        const formattedReceipts = receipts.map(receipt => ({
            ...receipt,
            type: 'receipt'
        }));
        const formattedExpenses = expenses.map(expense => ({
            ...expense,
            type: 'expense'
        }));

        const transactions = [...formattedReceipts, ...formattedExpenses];

        transactions.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        return transactions;
    }
    async getAllInvoicePaymentByInvoiceId(invoice_id: number): Promise<any> {
        const invoice = await this.invoiceService.getInvoiceById(invoice_id);

        const invoicePayments = await this.invoicePaymentRepository.find({
            where: { invoice_id },
        });

        return {
            invoice,
            payments: invoicePayments.map((payment) => ({
                id: payment.id,
                payment_date: payment.payment_date,
                amount: payment.amount,
                payment_method: payment.payment_method,
                note: payment.note,
            })),
        };
    }
}