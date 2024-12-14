import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, ValidationPipe } from "@nestjs/common";
import { ServiceService } from "./service.service";
import { HttpMessage, HttpStatus } from "src/global/globalEnum";
import { ResponData } from "src/global/globalClass";
import { Service } from "src/models/service.model";
import { CreateServiceDto } from "./dto/createService.dto";
import { UpdateServiceDto } from "./dto/updateService.dto";

@Controller('services')
export class ServiceController {
    constructor(private readonly serviceService: ServiceService) { }

    @Get()
    async getServices(): Promise<ResponData<Service[]>> {
        try {
            return new ResponData<Service[]>(await this.serviceService.getServices(), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData<Service[]>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Get('servicesByHotelId/:hotel_id')
    async getServicesByHotelId(
        @Param('hotel_id', ParseIntPipe) hotel_id: number
    ): Promise<ResponData<Service[]>> {
        try {
            return new ResponData<Service[]>(await this.serviceService.getServicesByHotelId(hotel_id), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData<Service[]>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Get('getServicesByHotelIdAdmin')
    async getServicesByHotelIdAdmin(
        @Query('hotel_id') hotel_id: number,
        @Query('currentPage') currentPage: number,
        @Query('pageSize') pageSize: number,
        @Query('status') status: string,
        @Query('search') search: string,
        @Query('name_category') name_category: string,
    ) {
        try {
            const result = await this.serviceService.getServicesByHotelIdAdmin(
                hotel_id,
                currentPage,
                pageSize,
                status,
                search,
                name_category,
            );
            return new ResponData<any>(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Get(':id')
    async findOneService(@Param('id') id: number): Promise<ResponData<Service>> {
        try {
            return new ResponData<Service>(await this.serviceService.findOneService(id), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData<Service>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Post()
    async createService(@Body(new ValidationPipe) createServiceDto: CreateServiceDto): Promise<ResponData<Service>> {
        try {
            return new ResponData<Service>(await this.serviceService.createService(createServiceDto), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData<Service>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Put()
    async updateService(@Body(new ValidationPipe) updateServiceDto: UpdateServiceDto): Promise<ResponData<Service>> {
        try {
            return new ResponData<Service>(await this.serviceService.updateService(updateServiceDto), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData<Service>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Delete('/deleteServices')
    async deleteServices(@Body() body: any): Promise<ResponData<string>> {
        try {
            const ids = body?.id;

            return new ResponData<string>(
                await this.serviceService.deleteServices(ids),
                HttpStatus.SUCCESS,
                HttpMessage.SUCCESS,
            );
        } catch (error) {
            return new ResponData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Delete(':id')
    async deleteService(@Param('id') id: number): Promise<ResponData<string>> {
        try {
            return new ResponData<string>(await this.serviceService.deleteService(id), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }


    @Put('updateStatus/:id')
    async updateStatus(
        @Param('id') id: number,
    ): Promise<ResponData<string>> {
        try {
            return new ResponData<string>(
                await this.serviceService.updateStatus(id),
                HttpStatus.SUCCESS,
                HttpMessage.SUCCESS,
            );
        } catch (error) {
            if (error.message) {
                return new ResponData<string>(null, HttpStatus.ERROR, error.message);
            }
            return new ResponData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }
}