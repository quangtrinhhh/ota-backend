import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateServiceDto {
    @IsNotEmpty({ message: 'name không được để trống' })
    name: string;

    @IsOptional()
    description: string;

    @IsNotEmpty({ message: 'unit_price không được để trống' })
    unit_price: number;

    @IsNotEmpty({ message: 'category_id không được để trống' })
    category_id: number;
}