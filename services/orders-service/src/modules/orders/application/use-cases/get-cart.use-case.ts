import { Inject, Injectable } from '@nestjs/common';

import { Cart } from '../../domain/entities/cart.entity.js';
import { CART_REPOSITORY } from '../../domain/ports/repositories/cart.repository.js';
import type { CartRepository } from '../../domain/ports/repositories/cart.repository.js';

@Injectable()
export class GetCartUseCase {
  constructor(
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: CartRepository,
  ) {}

  async execute(usuarioId: string): Promise<Cart> {
    const cart = await this.cartRepository.findActiveByUser(usuarioId);

    return cart ?? this.cartRepository.save(Cart.empty(usuarioId));
  }
}
