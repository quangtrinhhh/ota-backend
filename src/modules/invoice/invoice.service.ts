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
import { v4 as uuidv4 } from 'uuid';
import { TransactionService } from '../Transaction/transaction.service';
import {
  CreateTransactionDto,
  PaymentType,
} from '../Transaction/dto/createTransaction.dto';

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
    private readonly TransactionService: TransactionService,
  ) { }

  // Lấy danh sách tất cả hóa đơn
  async getInvoices(): Promise<Invoice[]> {
    const invoices = await this.invoiceRepository.find();
    return invoices.map(
      (invoice) =>
        new Invoice(
          invoice.id,
          invoice.issue_at,
          invoice.total_amount,
          invoice.discount_amount,
          invoice.discount_percentage,
          invoice.note_discount,
          invoice.note,
          invoice.customer_id,
          invoice.payment_method,
          invoice.status,
          invoice.booking_id,
          invoice.hotel_id,
        ),
    );
  }

  // Lấy chi tiết hóa đơn theo ID
  async getDetailInvoice(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({ where: { id } });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return new Invoice(
      invoice.id,
      invoice.issue_at,
      invoice.total_amount,
      invoice.discount_amount,
      invoice.discount_percentage,
      invoice.note_discount,
      invoice.note,
      invoice.customer_id,
      invoice.payment_method,
      invoice.status,
      invoice.booking_id,
      invoice.hotel_id,
    );
  }

  // Tạo mới hóa đơn
  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const invoice = this.invoiceRepository.create({
      ...createInvoiceDto,
    });
    await this.invoiceRepository.save(invoice);
    return new Invoice(
      invoice.id,
      invoice.issue_at,
      invoice.total_amount,
      invoice.discount_amount,
      invoice.discount_percentage,
      invoice.note_discount,
      invoice.note,
      invoice.customer_id,
      invoice.payment_method,
      invoice.status,
      invoice.booking_id,
      invoice.hotel_id,
    );
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

  async createInvoiceService(
    requestPaymentService: RequestPaymentService,
  ): Promise<any> {
    const invoice = this.invoiceRepository.create({
      total_amount: requestPaymentService.totalPrice,
      discount_amount:
        requestPaymentService.totalPrice *
        (requestPaymentService.discountForm.discount / 100),
      discount_percentage: requestPaymentService.discountForm.discount,
      note_discount: requestPaymentService.discountForm.note,
      note: requestPaymentService.note,
      payment_method: this.mapPaymentMethod(
        requestPaymentService.paymentMethod,
      ),
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

    let shortUuid = uuidv4().split('-')[0].slice(0, 5);

    await this.receiptService.createReceipt({
      code: this.mapPaymentMethod(requestPaymentService.paymentMethod) === 'Cash' ? `PTTM-${shortUuid}` : `PTTG-${shortUuid}`,
      amount: requestPaymentService.totalPrice - invoice.discount_amount,
      payment_method: this.mapPaymentMethod(
        requestPaymentService.paymentMethod,
      ),
      note: requestPaymentService.note,
      customer_name: requestPaymentService.customerName,
      hotel_id: requestPaymentService.hotel_id,
      category: 'Service',
      invoice_id: invoice.id,
      user_id: requestPaymentService.user_id,
    });
    // Gọi createTransactionCash để lưu giao dịch thu chi
    try {
      // Chuẩn bị dữ liệu cho giao dịch thu chi
      const paymentType = this.mapPaymentMethod(
        requestPaymentService.paymentMethod,
      );
      const transactionDto: CreateTransactionDto = {
        content: `Thu tiền từ quầy bán hàng số hóa đơn #${invoice.id}`, // Nội dung giao dịch
        note: requestPaymentService.note,
        transactionType: 'income',
        amount: requestPaymentService.totalPrice - invoice.discount_amount, // Số tiền thanh toán
        user_id: requestPaymentService.user_id, // ID người tạo
        paymentType:
          paymentType === 'Cash' ? PaymentType.CASH : PaymentType.BANK,
        created_at: new Date(), // Ngày tạo (mặc định hiện tại)
      };
      console.log(transactionDto);
      await this.TransactionService.createTransactionWithHotelId(
        transactionDto,
        requestPaymentService.user_id,
        requestPaymentService.hotel_id,
        'income',
        this.mapPaymentMethod(requestPaymentService.paymentMethod) === 'Cash' ? `PTTM-${shortUuid}` : `PTTG-${shortUuid}`,
      );
    } catch (error) {
      console.error('Error while creating transaction: lỗi: ', error.message);
      throw new Error('Transaction creation failed lỗi');
    }
    console.log(requestPaymentService);

    return {
      invoice_id: invoice.id,
    };
  }

  mapPaymentMethod(
    paymentMethod: string,
  ): 'Cash' | 'Bank_transfer' | 'Credit_card' {
    switch (paymentMethod) {
      case PAYMENT_METHODS.CASH:
        return 'Cash';
      case PAYMENT_METHODS.BANK_TRANSFER:
        return 'Bank_transfer';
      case PAYMENT_METHODS.CREDIT_CARD:
        return 'Credit_card';
    }
  }

  async getInvoiceByReceiptAndItemById(invoice_id: number): Promise<any> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoice_id },
      relations: ['items', 'items.service', 'receipts', 'customer'],
    });

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
      items: invoice.items.map((item) => ({
        id: item.id,
        service_name: item.service ? item.service.name : null,
        item_name: item.service ? null : item.item_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        invoice_id: item.invoice_id,
      })),
      customer: invoice.customer,
    };
    return formattedInvoice;
  }

  async getInvoiceById(invoice_id: number): Promise<any> {
    // Tìm hóa đơn liên kết với booking
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoice_id },
      relations: [
        'booking', // Liên kết với Booking
        'booking.booking_rooms', // Liên kết với BookingRoom
        'booking.booking_rooms.room', // Liên kết với Room
        'booking.booking_rooms.room.room_type', // Loại phòng
        'booking.booking_rooms.room.floor', // Tầng
        'booking.booking_rooms.room.hotel', // Khách sạn
        'booking.customer', // Thông tin khách hàng
      ],
    });
  
    if (!invoice) {
      throw new Error('Invoice not found'); // Xử lý nếu không tìm thấy invoice
    }
  
    // Lấy thông tin phòng từ BookingRoom
    const bookingRooms = invoice.booking.booking_rooms || [];
    const rooms = bookingRooms.map((bookingRoom) => {
      const room = bookingRoom.room;
      return {
        id: room.id,
        name: room.name,
        clean_status: room.clean_status,
        status: room.status,
        price: room.price,
        room_type: room.room_type?.name || null, // Loại phòng
        floor: room.floor?.name || null, // Tầng
        hotel: {
          id: room.hotel?.id || null,
          name: room.hotel?.name || null, // Thông tin khách sạn
        },
      };
    });
  
    // Trả về dữ liệu phòng và các thông tin khác
    return {
      invoice: {
        id: invoice.id,
        total: invoice.total_amount,
        status: invoice.status,
        discount_amount: invoice.discount_amount,
        discount_percentage: invoice.discount_percentage,
        booking_at: invoice.booking?.booking_at || null,
        check_in_at: invoice.booking?.check_in_at || null,
        check_out_at: invoice.booking?.check_out_at || null,
        note_discount: invoice.note_discount,
        note: invoice.note,
      },
      customer: {
        id: invoice.booking?.customer?.id || null,
        name: invoice.booking?.customer?.name || null,
        phone: invoice.booking?.customer?.phone || null,
        email: invoice.booking?.customer?.email || null,
      },
      rooms: rooms,
      bookings: {
        id: invoice.booking?.id || null,
        // booking_at: invoice.booking?.booking_at || null,
        // check_in_at: invoice.booking?.check_in_at || null,
        // check_out_at: invoice.booking?.check_out_at || null,
        // children: invoice.booking?.children || null,
        // adults: invoice.booking?.adults || null,
        // status: invoice.booking?.status || null,
        total: invoice.booking?.total_amount || null,
      },
    };
  }

  async getRoomDetailsByInvoice(invoice_id: number): Promise<any> {
    // Truy vấn thông tin hóa đơn và liên kết đến các bảng khác
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoice_id },
      relations: [
        'booking',                         // Liên kết với Booking
        'booking.customer',                // Liên kết với Customer
        'booking.booking_rooms',           // Liên kết với BookingRoom
        'booking.booking_rooms.room',      // Liên kết với Room
        'booking.booking_rooms.room.floor',// Liên kết với Floor
        'booking.booking_rooms.room.hotel',// Liên kết với Hotel
        'booking.booking_rooms.room.room_type', // Liên kết với RoomType
        'items',                   // Liên kết với InvoiceItems
        'items.service',           // Liên kết với Service
        'items.service.category',  // Liên kết với Category
      ],
    });
  
    if (!invoice) {
      throw new Error('Invoice not found');
    }
  
    // Lấy thông tin booking
    const booking = invoice.booking;
    if (!booking) {
      throw new Error('Booking not found for this invoice');
    }
  
    // Xử lý danh sách phòng liên quan đến booking
    const rooms = booking.booking_rooms.map(bookingRoom => {
      const room = bookingRoom.room;
      return {
        id: room.id,
        name: room.name,
        clean_status: room.clean_status,
        status: room.status,
        price: room.price,
        room_type: room.room_type?.name || null, // Nếu không có room_type, trả về null
        floor: room.floor?.name || null,         // Nếu không có floor, trả về null
        hotel: room.hotel
          ? { id: room.hotel.id, name: room.hotel.name }
          : null, // Nếu không có hotel, trả về null
      };
    });
  
    // Trả về dữ liệu đầy đủ
    return {
      invoice: {
        id: invoice.id,
        issue_at: invoice.issue_at,
        total_amount: invoice.total_amount,
        payment_method: invoice.payment_method,
        status: invoice.status,
        discount_amount: invoice.discount_amount,
        discount_percentage: invoice.discount_percentage,
        note: invoice.note,
      },
      booking: {
        id: booking.id,
        booking_at: booking.booking_at,
        check_in_at: booking.check_in_at,
        check_out_at: booking.check_out_at,
        children: booking.children,
        adults: booking.adults,
        status: booking.status,
        customer: booking.customer
          ? {
              id: booking.customer.id,
              name: booking.customer.name || null,
              phone: booking.customer.phone || null,
              email: booking.customer.email || null,
              gender: booking.customer.gender || null,
              birthday: booking.customer.birthday || null,
            }
          : null,
      },
      rooms,
    };
  }
  
    
}
