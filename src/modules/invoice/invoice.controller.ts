import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException } from "@nestjs/common";
import { ResponData } from "src/global/globalClass";
import { HttpMessage, HttpStatus } from "src/global/globalEnum";
import { InvoiceService } from "./invoice.service";
import { Invoice } from "src/models/invoice.model";
import { CreateInvoiceDto } from "./dto/createInvoice.dto";
import { UpdateInvoiceDto } from "./dto/updateInvoice.dto";
import { RequestPaymentService } from "./dto/requestPaymentService.dto";

@Controller('invoices')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) { }

    @Get()
    async getInvoices(): Promise<ResponData<Invoice[]>> {
        try {
            const invoices = await this.invoiceService.getInvoices();
            return new ResponData<Invoice[]>(invoices, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData<Invoice[]>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Get(':id')
    async getDetailInvoice(@Param('id') id: number): Promise<ResponData<Invoice>> {
        try {
            const invoice = await this.invoiceService.getDetailInvoice(id);
            return new ResponData<Invoice>(invoice, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData<Invoice>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }


    @Post('createInvoiceService')
    async createInvoiceService(@Body() requestPaymentService: RequestPaymentService): Promise<ResponData<string>> {
        try {
            return new ResponData<string>(await this.invoiceService.createInvoiceService(requestPaymentService), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            if (error.message) {
                return new ResponData<string>(null, HttpStatus.ERROR, error.message);
            }
            return new ResponData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Post()
    async createInvoice(@Body(new ValidationPipe) createInvoiceDto: CreateInvoiceDto): Promise<ResponData<Invoice>> {
        try {
            const invoice = await this.invoiceService.createInvoice(createInvoiceDto);
            return new ResponData<Invoice>(invoice, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData<Invoice>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Put(':id')
    async updateInvoice(
        @Param('id') id: number,
        @Body(new ValidationPipe) updateInvoiceDto: UpdateInvoiceDto
    ): Promise<ResponData<string>> {
        try {
            const message = await this.invoiceService.updateInvoice(id, updateInvoiceDto);
            return new ResponData<string>(message, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Delete(':id')
    async deleteInvoice(@Param('id') id: number): Promise<ResponData<string>> {
        try {
            const message = await this.invoiceService.deleteInvoice(id);
            return new ResponData<string>(message, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Get('innvoiceByReceiptAndItemById/:id')
    async getInvoiceByReceiptAndItemById(@Param('id') id: number): Promise<ResponData<Invoice>> {
        try {
            const invoice = await this.invoiceService.getInvoiceByReceiptAndItemById(id);
            return new ResponData<Invoice>(invoice, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData<Invoice>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Get('invoiceById/:invoice_id')
  async getInvoiceById(@Param('invoice_id') invoice_id: number) {
    try {
      // Gọi service để lấy chi tiết invoice theo invoice_id
      const invoiceDetails = await this.invoiceService.getInvoiceById(invoice_id);

      // Nếu không tìm thấy hóa đơn, có thể ném ra lỗi NotFoundException
      if (!invoiceDetails) {
        throw new NotFoundException(`Invoice with id ${invoice_id} not found`);
      }

      // Trả về dữ liệu từ service
      return { data: invoiceDetails };
    } catch (error) {
      // Nếu có lỗi khác, sẽ xử lý và trả về lỗi với thông báo phù hợp
      throw new NotFoundException('Invoice not found or error occurred');
    }
  }
}
