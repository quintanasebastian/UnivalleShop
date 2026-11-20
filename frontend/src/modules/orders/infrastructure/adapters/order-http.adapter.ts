import { request } from '../../../../shared/infrastructure/http-client';
import type { AddToCartInput, Cart, Order } from '../../domain/model/order.entity';
import type { OrdersPort } from '../../domain/ports/orders.port';

const base = import.meta.env.VITE_ORDERS_API_URL ?? '/api/pedidos';

function withBody(method: string, body: object): RequestInit {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

export const ordersHttpAdapter: OrdersPort = {
  getCart(signal) {
    return request<Cart>(`${base}/carrito`, { signal });
  },

  addItem(input: AddToCartInput) {
    return request<Cart>(`${base}/carrito/items`, withBody('POST', input));
  },

  updateItem(productoId, cantidad) {
    return request<Cart>(
      `${base}/carrito/items/${encodeURIComponent(productoId)}`,
      withBody('PATCH', { cantidad }),
    );
  },

  removeItem(productoId) {
    return request<Cart>(
      `${base}/carrito/items/${encodeURIComponent(productoId)}`,
      { method: 'DELETE' },
    );
  },

  checkout() {
    return request<Order>(`${base}/pedidos/checkout`, { method: 'POST' });
  },

  listOrders(signal) {
    return request<Order[]>(`${base}/pedidos`, { signal });
  },

  getOrder(id, signal) {
    return request<Order>(`${base}/pedidos/${encodeURIComponent(id)}`, { signal });
  },
};
