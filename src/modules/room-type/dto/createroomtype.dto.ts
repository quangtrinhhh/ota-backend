import { IsNotEmpty } from "class-validator";

export class CreateRoomTypeDto {
    @IsNotEmpty({message:"name room type không được để trống"})
    name: string;
    notes?: string;
    @IsNotEmpty({message:"hotel_id room type không được để trống"})
    hotel_id: number;
  }