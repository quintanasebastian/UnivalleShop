import { Inject, Injectable, Logger } from '@nestjs/common';

import { CartNotFoundError } from '../../domain/entities/cart.entity.js';
import { Order } from '../../domain/entities/order.entity.js';
import type { OrderItem } from '../../domain/entities/order-item.entity.js';
import { CART_REPOSITORY } from '../../domain/ports/repositories/cart.repository.js';
import type { CartRepository } from '../../domain/ports/repositories/cart.repository.js';
import { ORDER_REPOSITORY } from '../../domain/ports/repositories/order.repository.js';
import type { OrderRepository } from '../../domain/ports/repositories/order.repository.js';
import { PRODUCT_STOCK_PORT } from '../../domain/ports/services/product-stock.port.js';
import type { ProductStockPort } from '../../domain/ports/services/product-stock.port.js';

@Injectable()
export class CheckoutUseCase {
  private readonly logger = new Logger(CheckoutUseCase.name);

  constructor(
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: CartRepository,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
    @Inject(PRODUCT_STOCK_PORT)
    private readonly productStock: ProductStockPort,
  ) {}

  async execute(usuarioId: string): Promise<Order> {
    const cart = await this.cartRepository.findActiveByUser(usuarioId);

    if (!cart) {
      throw new CartNotFoundError();
    }

    const order = Order.fromCart(cart);
    const reserved: OrderItem[] = [];
    let savedOrder: Order | null = null;

    try {
      // 1. Reservar stock en Catalog Service (operación atómica allí).
      // Si un producto falla, se devuelve lo ya reservado en el catch.
      for (const item of order.items) {
        await this.productStock.decreaseStock(item.productoId, item.cantidad);
        reserved.push(item);
      }

      // 2. Persistir el pedido en estado pendiente en nuestra propia BD.
      savedOrder = await this.orderRepository.save(order);

      // 3. Cerrar el carrito solo cuando el pedido ya existe.
      await this.cartRepository.delete(cart.id);

      return savedOrder;
    } catch (error) {
      // Si el pedido llegó a guardarse pero no se pudo cerrar el carrito,
      // se elimina para no dejar un pedido duplicado/inconsistente.
      if (savedOrder) {
        try {
          await this.orderRepository.delete(savedOrder.id);
        } catch (cleanupError) {
          this.logger.error(
            `No se pudo eliminar el pedido ${savedOrder.id} durante la compensación.`,
            cleanupError instanceof Error ? cleanupError.stack : String(cleanupError),
          );
        }
      }

      for (const item of reserved.reverse()) {
        try {
          await this.productStock.restoreStock(item.productoId, item.cantidad);
        } catch (cleanupError) {
          this.logger.error(
            `No se pudo devolver el stock de ${item.productoId} durante la compensación.`,
            cleanupError instanceof Error ? cleanupError.stack : String(cleanupError),
          );
        }
      }

      throw error;
    }
  }
}
