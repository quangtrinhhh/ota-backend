import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from "@nestjs/common";
import { ReceiptService } from "./receip.service";
import { HttpMessage, HttpStatus } from "src/global/globalEnum";
import { ResponData } from "src/global/globalClass";
import { CreateReceiptDto } from "./dto/createReceipt.dto";
import { UpdateReceiptDto } from "./dto/updateReceipt.dto";
import { Receipt } from "src/models/receipt.model";
@Controller('receipt')
export class ReceiptController {
    constructor(private readonly receipService: ReceiptService) { }

    @Get()
    async getReceipts(): Promise<ResponData<Receipt[]>> {
        try {
            return new ResponData<Receipt[]>(await this.receipService.getReceipts(), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData<Receipt[]>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Get('receiptServiceByHotelId/:hotel_id')
    async getReceiptsByHotelId(@Param('hotel_id') hotel_id: number): Promise<ResponData<Receipt[]>> {
        try {
            return new ResponData<Receipt[]>(await this.receipService.getReceiptsServiceByHotelId(hotel_id), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData<Receipt[]>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Get(':id')
    async findOneReceipt(@Param('id') id: number): Promise<ResponData<any>> {
        try {
            return new ResponData<any>(await this.receipService.findOneReceipt(id), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData<any>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Post()
    async createReceipt(@Body(new ValidationPipe) createReceiptDto: CreateReceiptDto): Promise<ResponData<Receipt>> {
        try {
            return new ResponData<Receipt>(await this.receipService.createReceipt(createReceiptDto), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData<Receipt>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Put()
    async updateReceipt(@Body(new ValidationPipe) updateReceiptDto: UpdateReceiptDto): Promise<ResponData<Receipt>> {
        try {
            return new ResponData<Receipt>(await this.receipService.updateReceipt(updateReceiptDto), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData<Receipt>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Delete(':id')
    async deleteReceipt(@Param('id') id: number): Promise<ResponData<string>> {
        try {
            return new ResponData<string>(await this.receipService.deleteReceipt(id), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }
}