import type { Cart } from '../../entities/cart.entity.js';

export interface CartRepository {
  findActiveByUser(usuarioId: string): Promise<Cart | null>;

  findById(id: string): Promise<Cart | null>;

  save(cart: Cart): Promise<Cart>;

  delete(id: string): Promise<void>;
}

export const CART_REPOSITORY = Symbol('CART_REPOSITORY');
