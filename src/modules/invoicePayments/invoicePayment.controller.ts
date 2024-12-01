import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from "@nestjs/common";
import { InvoicePaymentService } from "./invoicePayment.service";
import { HttpMessage, HttpStatus } from "src/global/globalEnum";
import { ResponData } from "src/global/globalClass";
import { CreateInvoicePaymentDto } from "./dto/createInvoicePayment.dto";
import { UpdateInvoicePaymentDto } from "./dto/updateInvoicePayment.dto";
import { InvoicePayment } from "src/models/invoicePayment.model";
import { RequestTransactionDto } from "./dto/requestTransaction.dto";

@Controller('invoicePayments')
export class InvoicePaymentController {
    constructor(private readonly invoicePaymentService: InvoicePaymentService) { }

    @Get()
    async getInvoicePayments(): Promise<ResponData<InvoicePayment[]>> {
        try {
            return new ResponData<InvoicePayment[]>(await this.invoicePaymentService.getInvoicePayments(), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData<InvoicePayment[]>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Get('allReceiptAndExpenseByInvoiceId/:invoice_id')
    async getAllReceiptAndExpenseByInvoiceId(@Param('invoice_id') invoice_id: number): Promise<ResponData<InvoicePayment[]>> {
        try {
            return new ResponData<InvoicePayment[]>(await this.invoicePaymentService.getAllReceiptAndExpenseByInvoiceId(invoice_id), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData<InvoicePayment[]>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }


    @Get(':id')
    async findOneInvoicePayment(@Param('id') id: number): Promise<ResponData<InvoicePayment>> {
        try {
            return new ResponData<InvoicePayment>(await this.invoicePaymentService.findOneInvoicePayment(id), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData<InvoicePayment>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Post('handleTransaction')
    async handleTransaction(@Body(new ValidationPipe) requestTransactionDto: RequestTransactionDto): Promise<ResponData<any>> {
        try {
            return new ResponData<any>(await this.invoicePaymentService.handleTransaction(requestTransactionDto), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData<any>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Post()
    async createInvoicePayment(@Body(new ValidationPipe) createInvoicePaymentDto: CreateInvoicePaymentDto): Promise<ResponData<InvoicePayment>> {
        try {
            return new ResponData<InvoicePayment>(await this.invoicePaymentService.createInvoicePayment(createInvoicePaymentDto), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData<InvoicePayment>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Put()
    async updateInvoicePayment(@Body(new ValidationPipe) updateInvoicePaymentDto: UpdateInvoicePaymentDto): Promise<ResponData<InvoicePayment>> {
        try {
            return new ResponData<InvoicePayment>(await this.invoicePaymentService.updateInvoicePayment(updateInvoicePaymentDto), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData<InvoicePayment>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Delete(':id')
    async deleteInvoicePayment(@Param('id') id: number): Promise<ResponData<string>> {
        try {
            return new ResponData<string>(await this.invoicePaymentService.deleteInvoicePayment(id), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }
}