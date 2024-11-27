import { Module } from "@nestjs/common";
import { StatisticsController } from "./statistics.controller";
import { StatisticsService } from "./statistics.service";
import { RoomEntity } from "src/entities/room.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookingEntity } from "src/entities/booking.entity";

@Module({
    imports: [TypeOrmModule.forFeature([
        RoomEntity,
        BookingEntity,
    ]),
    ],
    controllers: [StatisticsController],
    providers: [StatisticsService],
})
export class StatisticsModule { }