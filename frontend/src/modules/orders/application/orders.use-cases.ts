import type { OrdersPort } from '../domain/ports/orders.port';
import type { AddToCartInput } from '../domain/model/order.entity';

export function getCart(port: OrdersPort, signal?: AbortSignal) {
  return port.getCart(signal);
}

export function addToCart(port: OrdersPort, input: AddToCartInput) {
  return port.addItem(input);
}

export function changeCartItem(port: OrdersPort, productoId: string, cantidad: number) {
  return port.updateItem(productoId, cantidad);
}

export function removeCartItem(port: OrdersPort, productoId: string) {
  return port.removeItem(productoId);
}

export function checkout(port: OrdersPort) {
  return port.checkout();
}

export function listOrders(port: OrdersPort, signal?: AbortSignal) {
  return port.listOrders(signal);
}

export function getOrderDetail(port: OrdersPort, id: string, signal?: AbortSignal) {
  return port.getOrder(id, signal);
}
