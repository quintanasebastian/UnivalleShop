import { Inject, Injectable } from '@nestjs/common';

import {
  OrderAccessDeniedError,
  OrderNotFoundError,
} from '../../domain/entities/order.entity.js';
import type { OrderStatus } from '../../domain/entities/order.entity.js';
import { ORDER_REPOSITORY } from '../../domain/ports/repositories/order.repository.js';
import type { OrderRepository } from '../../domain/ports/repositories/order.repository.js';

export interface ChangeOrderStatusInput {
  usuarioId: string;
  id: string;
  estado: OrderStatus;
}

@Injectable()
export class ChangeOrderStatusUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(input: ChangeOrderStatusInput) {
    const order = await this.orderRepository.findById(input.id);

    if (!order) {
      throw new OrderNotFoundError();
    }

    if (!order.isOwnedBy(input.usuarioId)) {
      throw new OrderAccessDeniedError();
    }

    order.changeStatus(input.estado);

    return this.orderRepository.save(order);
  }
}
