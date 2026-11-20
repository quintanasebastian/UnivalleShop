import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { MAX_ITEM_QUANTITY } from '../../domain/entities/order-item.entity.js';

export class AddCartItemDto {
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  productoId!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  nombre!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precioUnitario!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_ITEM_QUANTITY)
  cantidad!: number;
}
