import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingEntity } from 'src/entities/booking.entity';
import { BookingRoomEntity } from 'src/entities/bookingRoom.entity';
import { RoomEntity } from 'src/entities/room.entity';
import { CustomerEntity } from 'src/entities/customer.entity';
import { HotelEntity } from 'src/entities/hotel.entity';
import { InvoiceModule } from '../invoice/invoice.module';
import { InvoicePaymentModule } from '../invoicePayments/invoicePayment.module';
import { ReceiptModule } from '../receips/receip.module';
import { TransactionModule } from '../Transaction/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BookingEntity,
      BookingRoomEntity,
      RoomEntity,
      CustomerEntity,
      HotelEntity,
    ]),
    InvoiceModule,
    InvoicePaymentModule,
    ReceiptModule,
    TransactionModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule { }
