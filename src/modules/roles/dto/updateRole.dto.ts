import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateRoleDto {
    @IsNotEmpty({ message: 'id không được để trống' })
    id: number;

    @IsOptional()
    name: string;

    @IsOptional()
    description: string;

    @IsOptional()
    hotel_id: number;
}