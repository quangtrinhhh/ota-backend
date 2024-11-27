import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { ResponData } from "src/global/globalClass";
import { HttpMessage, HttpStatus } from "src/global/globalEnum";
import { StatisticsService } from "./statistics.service";

@Controller('statistics')
export class StatisticsController {
    constructor(
        private readonly statisticsService: StatisticsService
    ) { }
    @Get('getRoomCapacityAndOccupancy/:hotel_id')
    async getRoomCapacityAndOccupancy(@Param('hotel_id', ParseIntPipe) hotel_id: number) {
        try {
            return new ResponData(await this.statisticsService.getRoomCapacityAndOccupancy(hotel_id), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }
    @Get('getTodayActivities/:hotel_id')
    async getTodayActivities(@Param('hotel_id', ParseIntPipe) hotel_id: number) {
        try {
            return new ResponData(await this.statisticsService.getTodayActivities(hotel_id), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }
}