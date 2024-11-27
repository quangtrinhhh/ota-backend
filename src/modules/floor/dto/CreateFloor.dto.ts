import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFloorDto {
  @IsNotEmpty({ message: 'Tên khu vực không được bỏ trống' })
  name: string;

  @Type(() => Number)
  @IsOptional()
  floor_id: number;

  @IsOptional()
  note: string;
}
