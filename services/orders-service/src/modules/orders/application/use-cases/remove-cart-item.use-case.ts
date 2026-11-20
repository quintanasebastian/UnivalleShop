import { Inject, Injectable } from '@nestjs/common';

import { CartNotFoundError } from '../../domain/entities/cart.entity.js';
import { CART_REPOSITORY } from '../../domain/ports/repositories/cart.repository.js';
import type { CartRepository } from '../../domain/ports/repositories/cart.repository.js';

export interface RemoveCartItemInput {
  usuarioId: string;
  productoId: string;
}

@Injectable()
export class RemoveCartItemUseCase {
  constructor(
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: CartRepository,
  ) {}

  async execute(input: RemoveCartItemInput) {
    const cart = await this.cartRepository.findActiveByUser(input.usuarioId);

    if (!cart) {
      throw new CartNotFoundError();
    }

    cart.removeItem(input.productoId);

    return this.cartRepository.save(cart);
  }
}
