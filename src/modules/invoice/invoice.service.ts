import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceEntity } from 'src/entities/invoice.entity';
import { CreateInvoiceDto } from './dto/createInvoice.dto';
import { UpdateInvoiceDto } from './dto/updateInvoice.dto';
import { Invoice } from 'src/models/invoice.model';
import { PAYMENT_METHODS } from 'src/constants/constants';
import { InvoiceItemEntity } from 'src/entities/invoiceItems.entity';
import { ReceiptEntity } from 'src/entities/receipt.entity';
import { RequestPaymentService } from './dto/requestPaymentService.dto';
import { InvoiceItemService } from '../invoiceItems/invoiceItem.service';
import { ReceiptService } from '../receips/receip.service';
import { ServiceService } from '../services/service.service';
import { log } from 'console';

@Injectable()
export class InvoiceService {
    constructor(
        @InjectRepository(InvoiceEntity)
        private readonly invoiceRepository: Repository<InvoiceEntity>,
        private invoiceItemService: InvoiceItemService,
        private receiptService: ReceiptService,
        private serviceService: ServiceService,

        @InjectRepository(ReceiptEntity)
        private receiptRepository: Repository<ReceiptEntity>,
    ) { }

    // Lấy danh sách tất cả hóa đơn
    async getInvoices(): Promise<Invoice[]> {
        const invoices = await this.invoiceRepository.find();
        return invoices.map(
            (invoice) => new Invoice(invoice.id, invoice.issue_at, invoice.total_amount, invoice.discount_amount, invoice.discount_percentage, invoice.note_discount, invoice.note, invoice.customer_id, invoice.payment_method, invoice.status, invoice.booking_id, invoice.hotel_id),
        );
    }

    // Lấy chi tiết hóa đơn theo ID
    async getDetailInvoice(id: number): Promise<Invoice> {
        const invoice = await this.invoiceRepository.findOne({ where: { id } });
        if (!invoice) {
            throw new NotFoundException(`Invoice with ID ${id} not found`);
        }
        return new Invoice(invoice.id, invoice.issue_at, invoice.total_amount, invoice.discount_amount, invoice.discount_percentage, invoice.note_discount, invoice.note, invoice.customer_id, invoice.payment_method, invoice.status, invoice.booking_id, invoice.hotel_id);
    }

    // Tạo mới hóa đơn
    async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
        const invoice = this.invoiceRepository.create({
            ...createInvoiceDto,
        });
        await this.invoiceRepository.save(invoice);
        return new Invoice(invoice.id, invoice.issue_at, invoice.total_amount, invoice.discount_amount, invoice.discount_percentage, invoice.note_discount, invoice.note, invoice.customer_id, invoice.payment_method, invoice.status, invoice.booking_id, invoice.hotel_id);
    }

    // Cập nhật hóa đơn theo ID
    async updateInvoice(id: number, updateInvoiceDto: UpdateInvoiceDto) {
        const invoice = await this.getDetailInvoice(id);
        Object.assign(invoice, updateInvoiceDto);
        await this.invoiceRepository.save(invoice);
        return 'Update success';
    }

    // Xóa hóa đơn theo ID
    async deleteInvoice(id: number): Promise<string> {
        const result = await this.invoiceRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Invoice with ID ${id} not found`);
        }
        return `Delete invoice ${id} success`;
    }

    async createInvoiceService(requestPaymentService: RequestPaymentService): Promise<any> {
        console.log(requestPaymentService);

        const invoice = this.invoiceRepository.create({
            total_amount: requestPaymentService.totalPrice,
            discount_amount: requestPaymentService.totalPrice * (requestPaymentService.discountForm.discount / 100),
            discount_percentage: requestPaymentService.discountForm.discount,
            note_discount: requestPaymentService.discountForm.note,
            note: requestPaymentService.note,
            payment_method: this.mapPaymentMethod(requestPaymentService.paymentMethod),
            status: 'Paid',
            hotel_id: requestPaymentService.hotel_id,
        });
        await this.invoiceRepository.save(invoice);

        for (const item of requestPaymentService.selectedService) {
            const serviceExists = await this.serviceService.findOneService(item.id);

            await this.invoiceItemService.createInvoiceItem({
                service_id: serviceExists ? item.id : null,
                item_name: serviceExists ? null : item.name,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total_price: item.unit_price * item.quantity,
                invoice_id: invoice.id,
            });
        }

        await this.receiptService.createReceipt({
            code: `PT00${invoice.id}`,
            amount: requestPaymentService.totalPrice - invoice.discount_amount,
            payment_method: this.mapPaymentMethod(requestPaymentService.paymentMethod),
            note: requestPaymentService.note,
            customer_name: requestPaymentService.customerName,
            hotel_id: requestPaymentService.hotel_id,
            category: "Service",
            invoice_id: invoice.id,
            created_by: requestPaymentService.created_by,
        });

        return {
            invoice_id: invoice.id,
        }
    }

    mapPaymentMethod(paymentMethod: string): "Cash" | "Bank_transfer" | "Credit_card" {
        switch (paymentMethod) {
            case PAYMENT_METHODS.CASH:
                return "Cash";
            case PAYMENT_METHODS.BANK_TRANSFER:
                return "Bank_transfer";
            case PAYMENT_METHODS.CREDIT_CARD:
                return "Credit_card";
        }
    }

    async getInvoiceByReceiptAndItemById(invoice_id: number): Promise<any> {
        const invoice = await this.invoiceRepository.findOne({
            where: { id: invoice_id },
            relations: ['items', 'items.service', 'receipts', 'customer',]
        })

        const formattedInvoice = {
            id: invoice.id,
            status: invoice.status,
            discount_amount: invoice.discount_amount,
            discount_percentage: invoice.discount_percentage,
            payment_method: invoice.payment_method,
            code: invoice.receipts[0].code,
            created_by: invoice.receipts[0].created_by,
            customer_name: invoice.receipts[0].customer_name,
            createdAt: invoice.receipts[0].createdAt,
            amount: invoice.receipts[0].amount,
            items: invoice.items.map(item => ({
                id: item.id,
                service_name: item.service ? item.service.name : null,
                item_name: item.service ? null : item.item_name,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total_price: item.total_price,
                invoice_id: item.invoice_id,
            })),
            customer: invoice.customer
        }
        return formattedInvoice;
    }
}
