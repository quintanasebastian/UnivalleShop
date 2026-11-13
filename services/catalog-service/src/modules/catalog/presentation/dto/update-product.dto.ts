import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { PRODUCT_CATEGORIES } from '../../domain/entities/product.entity.js';
import type { ProductCategory } from '../../domain/entities/product.entity.js';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  descripcion?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precio?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsIn([...PRODUCT_CATEGORIES])
  categoria?: ProductCategory;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(2048)
  imagen?: string;
}
