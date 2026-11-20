import { Inject, Injectable } from '@nestjs/common';

import {
  OrderAccessDeniedError,
  OrderNotFoundError,
} from '../../domain/entities/order.entity.js';
import { ORDER_REPOSITORY } from '../../domain/ports/repositories/order.repository.js';
import type { OrderRepository } from '../../domain/ports/repositories/order.repository.js';

export interface FindOrderByIdInput {
  usuarioId: string;
  id: string;
}

@Injectable()
export class FindOrderByIdUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(input: FindOrderByIdInput) {
    const order = await this.orderRepository.findById(input.id);

    if (!order) {
      throw new OrderNotFoundError();
    }

    if (!order.isOwnedBy(input.usuarioId)) {
      throw new OrderAccessDeniedError();
    }

    return order;
  }
}
