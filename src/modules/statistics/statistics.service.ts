import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ROOM_STATUS } from 'src/constants/constants';
import { BookingEntity } from 'src/entities/booking.entity';
import { RoomEntity, RoomStatus } from 'src/entities/room.entity';
import { And, Between, In, IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class StatisticsService {
    constructor(
        @InjectRepository(RoomEntity)
        private readonly roomRepository: Repository<RoomEntity>,

        @InjectRepository(BookingEntity)
        private readonly bookingRepository: Repository<BookingEntity>,
    ) { }

    async getRoomCapacityAndOccupancy(hotel_id: number): Promise<any> {
        const room = await this.roomRepository.find({ where: { hotel_id } });
        const roomInUser = await this.roomRepository.find({
            where: {
                hotel_id,
                status: Not(ROOM_STATUS.EMPTY as RoomStatus),
            },
        });
        const roomCapacity: string =
            ((roomInUser.length / room.length) * 100).toFixed(1) + '%';
        const totalPeople = {
            children: 0,
            adults: 0,
        };

        const bookings = await this.bookingRepository.find({
            where: { status: 'CheckedIn' },
        });
        bookings.forEach((booking) => {
            totalPeople.adults += booking.adults;
            totalPeople.children += booking.children;
        });

        return {
            roomCapacity: roomCapacity,
            totalPeople,
        };
    }

    async getTodayActivities(hotel_id: number): Promise<any> {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0); // 00:00:00

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999); // 23:59:59

        // Đếm số khách đã đến trong ngày
        const checkedIn = await this.bookingRepository.count({
            where: {
                status: 'CheckedIn',
                check_in_at: Between(startOfDay, endOfDay),
                hotel_id,
            },
        });

        // Đếm số khách dự kiến đến trong ngày
        const expectedArrival = await this.bookingRepository.count({
            where: {
                status: 'Booked',
                booking_at: Between(startOfDay, endOfDay),
                hotel_id,
            },
        });

        // Đếm số khách đã đi trong ngày
        const checkedOut = await this.bookingRepository.count({
            where: {
                status: 'CheckedOut',
                check_out_at: Between(startOfDay, endOfDay),
                hotel_id,
            },
        });

        // Đếm số khách dự kiến đi trong ngày
        const expectedDeparture = await this.bookingRepository.count({
            where: [
                {
                    status: 'Booked',
                    check_out_at: Between(startOfDay, endOfDay),
                    hotel_id,
                },
                {
                    status: 'CheckedIn',
                    check_in_at: Not(IsNull()),
                    check_out_at: Between(startOfDay, endOfDay),
                    hotel_id,
                },
            ],
        });

        // Đếm số khách đến và đi trong ngày
        const arrivedAndDeparted = await this.bookingRepository.count({
            where: [
                {
                    status: 'Booked',
                    check_in_at: IsNull(), // Chỉ kiểm tra khách chưa đến (check_in_at null)
                    booking_at: Between(startOfDay, endOfDay),
                    check_out_at: Between(startOfDay, endOfDay),
                    hotel_id,
                },
                {
                    status: 'CheckedIn',
                    check_in_at: Between(startOfDay, endOfDay),
                    check_out_at: Between(startOfDay, endOfDay),
                    hotel_id,
                },
            ],
        });
        return {
            checkedIn,
            expectedArrival,
            checkedOut,
            expectedDeparture,
            arrivedAndDeparted,
        };
    }
}
