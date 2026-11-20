import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

import { MAX_ITEM_QUANTITY } from '../../domain/entities/order-item.entity.js';

export class UpdateCartItemDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_ITEM_QUANTITY)
  cantidad!: number;
}
