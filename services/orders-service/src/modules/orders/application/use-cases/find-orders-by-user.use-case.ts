import { Inject, Injectable } from '@nestjs/common';

import { ORDER_REPOSITORY } from '../../domain/ports/repositories/order.repository.js';
import type { OrderRepository } from '../../domain/ports/repositories/order.repository.js';

@Injectable()
export class FindOrdersByUserUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
  ) {}

  execute(usuarioId: string) {
    return this.orderRepository.findByUser(usuarioId);
  }
}
