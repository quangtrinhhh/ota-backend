import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateRoomTypeDto {
  @IsNotEmpty({ message: 'Tên loại phòng không được để trống' })
  name: string;

  @IsOptional()
  notes: string;

  @IsOptional()
  code: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber({}, { message: 'Giá thuê theo giờ phải là một số hợp lệ' })
  hourlyRate: number; // Giá thuê theo giờ

  @Type(() => Number)
  @IsOptional()
  @IsNumber({}, { message: 'Giá thuê theo ngày phải là một số hợp lệ' })
  dailyRate: number; // Giá thuê theo ngày

  @Type(() => Number)
  @IsOptional()
  @IsNumber({}, { message: 'overnightRate là một số hợp lệ' })
  overnightRate: number; // Giá thuê qua đêm

  @Type(() => Number) // Đảm bảo giá trị được chuyển đổi thành kiểu số
  @IsOptional()
  @IsNumber({}, { message: 'standardCapacity là một số hợp lệ' })
  standardCapacity: number; // Sức chứa tiêu chuẩn (người lớn)

  @Type(() => Number) // Đảm bảo giá trị được chuyển đổi thành kiểu số
  @IsOptional()
  @IsNumber({}, { message: 'standardChildren là một số hợp lệ' })
  standardChildren: number; // Sức chứa tiêu chuẩn (trẻ em)

  @Type(() => Number) // Đảm bảo giá trị được chuyển đổi thành kiểu số
  @IsOptional()
  @IsNumber({}, { message: 'maxCapacity là một số hợp lệ' })
  maxCapacity: number; // Sức chứa tối đa (người lớn)

  @Type(() => Number) // Đảm bảo giá trị được chuyển đổi thành kiểu số
  @IsOptional()
  @IsNumber({}, { message: 'maxChildren là một số hợp lệ' })
  maxChildren: number; // Sức chứa tối đa (trẻ em)      
}
