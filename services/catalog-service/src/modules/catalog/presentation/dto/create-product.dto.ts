import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { PRODUCT_CATEGORIES } from '../../domain/entities/product.entity.js';
import type { ProductCategory } from '../../domain/entities/product.entity.js';

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  nombre!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  descripcion!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precio!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock!: number;

  @IsIn([...PRODUCT_CATEGORIES])
  categoria!: ProductCategory;

  @IsString()
  @MinLength(1)
  @MaxLength(2048)
  imagen!: string;
}
