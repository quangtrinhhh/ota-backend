import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { CreateReceiptDto } from "./dto/createReceipt.dto";
import { UpdateReceiptDto } from "./dto/updateReceipt.dto";
import { ReceiptEntity } from "src/entities/receipt.entity";
import { Receipt } from "src/models/receipt.model";

@Injectable()
export class ReceiptService {
    constructor(
        @InjectRepository(ReceiptEntity)
        private readonly receiptRepository: Repository<ReceiptEntity>
    ) { }

    async getReceipts(): Promise<Receipt[]> {
        const receipts = await this.receiptRepository.find();
        return receipts.map(
            receipt => new Receipt(receipt.id, receipt.code, receipt.amount, receipt.payment_method, receipt.note, receipt.customer_name, receipt.user_id, receipt.hotel_id, receipt.category, receipt.invoice_id));
    }

    async findOneReceipt(id: number): Promise<any> {
        const receipt = await this.receiptRepository.findOne({ where: { id } });
        return {
            id: receipt.id,
            code: receipt.code,
            amount: receipt.amount,
            payment_method: receipt.payment_method,
            note: receipt.note,
            customer_name: receipt.customer_name,
            user_id: receipt.user_id,
            hotel_id: receipt.hotel_id,
            category: receipt.category,
            invoice_id: receipt.invoice_id,
            createdAt: receipt.createdAt,
        }
    }

    async createReceipt(createReceiptDto: CreateReceiptDto): Promise<Receipt> {
        const receipt = new Receipt();
        receipt.code = createReceiptDto.code;
        receipt.amount = createReceiptDto.amount;
        receipt.payment_method = createReceiptDto.payment_method;
        receipt.note = createReceiptDto.note;
        receipt.customer_name = createReceiptDto.customer_name;
        receipt.user_id = createReceiptDto.user_id;
        receipt.hotel_id = createReceiptDto.hotel_id;
        receipt.category = createReceiptDto.category;
        receipt.invoice_id = createReceiptDto.invoice_id;

        await this.receiptRepository.save(receipt);
        return new Receipt(receipt.id, receipt.code, receipt.amount, receipt.payment_method, receipt.note, receipt.customer_name, receipt.user_id, receipt.hotel_id, receipt.category, receipt.invoice_id);
    }

    async updateReceipt(updateReceiptDto: UpdateReceiptDto): Promise<Receipt> {
        const { id, ...updateReceiptData } = updateReceiptDto;

        await this.receiptRepository.update(id, updateReceiptData);

        const receipt = await this.receiptRepository.findOne({ where: { id } })
        return new Receipt(receipt.id, receipt.code, receipt.amount, receipt.payment_method, receipt.note, receipt.customer_name, receipt.user_id, receipt.hotel_id, receipt.category, receipt.invoice_id);
    }

    async deleteReceipt(id: number): Promise<string> {
        await this.receiptRepository.delete(id);
        return `Delete receipt ${id} success`;
    }

    async getReceiptsServiceByHotelId(
        hotel_id: number,
        currentPage: number,
        pageSize: number,
        startDate: string,
        endDate: string,
    ): Promise<any> {
        const skip = (currentPage - 1) * pageSize;

        const startOfDay = this.getStartOfDay(startDate);
        const endOfDay = this.getEndOfDay(endDate);

        const [receipts, total] = await this.receiptRepository.findAndCount({
            relations: ['user'],
            where: {
                hotel_id,
                category: 'Service',
                createdAt: Between(new Date(startOfDay), new Date(endOfDay)),
            },
            skip,//vi tri bat dau
            take: pageSize,//so luong bang ghi muon lay
        });

        return {
            total: total,
            receipts: receipts.map(
                receipt => ({
                    id: receipt.id,
                    code: receipt.code,
                    amount: receipt.amount,
                    payment_method: receipt.payment_method,
                    note: receipt.note,
                    customer_name: receipt.customer_name,
                    created_by: receipt.user.user_name,
                    hotel_id: receipt.hotel_id,
                    category: receipt.category,
                    invoice_id: receipt.invoice_id,
                    createdAt: receipt.createdAt,
                }))
        }
    }
    // Hàm để chuyển chuỗi ngày thành đầu ngày
    getStartOfDay = (dateString: string): Date => {
        const date = new Date(dateString);
        date.setHours(0, 0, 0, 0); // Đặt giờ về 00:00:00
        return date;
    };

    // Hàm để chuyển chuỗi ngày thành cuối ngày
    getEndOfDay = (dateString: string): Date => {
        const date = new Date(dateString);
        date.setHours(23, 59, 59, 999); // Đặt giờ về 23:59:59.999
        return date;
    };
}