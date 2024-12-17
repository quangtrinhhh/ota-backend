import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty({ message: 'name không được để trống' })
    name: string;

    @IsOptional()
    description: string;


    @IsNotEmpty({ message: 'hotel_id không được để trống' })
    hotel_id: number;
}