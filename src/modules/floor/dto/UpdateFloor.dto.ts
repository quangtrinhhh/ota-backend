import { IsOptional } from 'class-validator';

export class UpdateFloorDto {
  @IsOptional()
  name?: string; // Tên tầng có thể được cập nhật
  @IsOptional()
  floor_id?: number; // Mức độ của tầng có thể được cập nhật
  @IsOptional()
  note?: string; // Chú thích có thể được cập nhật
}
