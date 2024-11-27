import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateRoomTypeDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  hourlyRate?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  dailyRate?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  overnightRate?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  standardCapacity?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  standardChildren?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  maxCapacity?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  maxChildren?: number;
}
