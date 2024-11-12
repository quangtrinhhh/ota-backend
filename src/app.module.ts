import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { RoleEntity } from './entities/role.entity';
import { UserEntity } from './entities/user.entity';
import { RoomTypeEntity } from './entities/roomType.entity';
import { RoomEntity } from './entities/room.entity';
import { BookingRoomEntity } from './entities/bookingRoom.entity';
import { BookingEntity } from './entities/booking.entity';
import { CustomerEntity } from './entities/customer.entity';
import { InvoiceEntity } from './entities/invoice.entity';
import { UseModule } from './modules/users/user.module';
import { HotelEntity } from './entities/hotel.entity';
import { roomTypeModule } from './modules/room-type/roomType.module';
import { roomModule } from './modules/room/room.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        HotelEntity,
        RoleEntity,
        UserEntity,
        RoomTypeEntity,
        RoomEntity,
        BookingRoomEntity,
        CustomerEntity,
        BookingEntity,
        InvoiceEntity,
      ],
      synchronize: true,
    }),
    UseModule,
    roomTypeModule,
    roomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) { }
}
