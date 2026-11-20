import type { Order } from '../../entities/order.entity.js';

export interface OrderRepository {
  save(order: Order): Promise<Order>;

  findById(id: string): Promise<Order | null>;

  findByUser(usuarioId: string): Promise<Order[]>;

  /** Elimina un pedido creado durante un checkout que debe ser compensado. */
  delete(id: string): Promise<void>;
}

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');
