import { Inject, Injectable } from '@nestjs/common';

import { OrderItem } from '../../domain/entities/order-item.entity.js';
import { CART_REPOSITORY } from '../../domain/ports/repositories/cart.repository.js';
import type { CartRepository } from '../../domain/ports/repositories/cart.repository.js';
import { GetCartUseCase } from './get-cart.use-case.js';

export interface AddItemToCartInput {
  usuarioId: string;
  productoId: string;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
}

@Injectable()
export class AddItemToCartUseCase {
  constructor(
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: CartRepository,
    private readonly getCartUseCase: GetCartUseCase,
  ) {}

  async execute(input: AddItemToCartInput) {
    const item = OrderItem.create({
      productoId: input.productoId,
      nombre: input.nombre,
      precioUnitario: input.precioUnitario,
      cantidad: input.cantidad,
    });

    const cart = await this.getCartUseCase.execute(input.usuarioId);
    cart.addItem(item);

    return this.cartRepository.save(cart);
  }
}
