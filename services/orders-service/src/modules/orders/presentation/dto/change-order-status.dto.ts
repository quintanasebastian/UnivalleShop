import { IsIn } from 'class-validator';

import { ORDER_STATUSES } from '../../domain/entities/order.entity.js';
import type { OrderStatus } from '../../domain/entities/order.entity.js';

export class ChangeOrderStatusDto {
  @IsIn([...ORDER_STATUSES])
  estado!: OrderStatus;
}
