import { Inject, Injectable } from '@nestjs/common';

import { CartNotFoundError } from '../../domain/entities/cart.entity.js';
import { CART_REPOSITORY } from '../../domain/ports/repositories/cart.repository.js';
import type { CartRepository } from '../../domain/ports/repositories/cart.repository.js';

export interface UpdateCartItemInput {
  usuarioId: string;
  productoId: string;
  cantidad: number;
}

@Injectable()
export class UpdateCartItemUseCase {
  constructor(
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: CartRepository,
  ) {}

  async execute(input: UpdateCartItemInput) {
    const cart = await this.cartRepository.findActiveByUser(input.usuarioId);

    if (!cart) {
      throw new CartNotFoundError();
    }

    cart.updateQuantity(input.productoId, input.cantidad);

    return this.cartRepository.save(cart);
  }
}
