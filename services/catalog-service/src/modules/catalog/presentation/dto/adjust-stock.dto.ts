import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

import { MAX_STOCK_MOVEMENT } from '../../domain/entities/product.entity.js';

export class AdjustStockDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_STOCK_MOVEMENT)
  cantidad!: number;
}
