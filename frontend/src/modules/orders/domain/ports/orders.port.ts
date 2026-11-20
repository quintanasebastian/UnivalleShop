import type { AddToCartInput, Cart, Order } from '../model/order.entity';

export interface OrdersPort {
  getCart(signal?: AbortSignal): Promise<Cart>;
  addItem(input: AddToCartInput): Promise<Cart>;
  updateItem(productoId: string, cantidad: number): Promise<Cart>;
  removeItem(productoId: string): Promise<Cart>;
  checkout(): Promise<Order>;
  listOrders(signal?: AbortSignal): Promise<Order[]>;
  getOrder(id: string, signal?: AbortSignal): Promise<Order>;
}
