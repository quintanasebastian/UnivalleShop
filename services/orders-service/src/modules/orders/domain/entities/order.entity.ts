import { Cart } from './cart.entity.js';
import { OrderItem } from './order-item.entity.js';
import type { OrderItemData } from './order-item.entity.js';

export const ORDER_STATUSES = ['pendiente', 'confirmado', 'cancelado'] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderData {
  id: string;
  usuarioId: string;
  items: OrderItemData[];
  estado: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ALLOWED_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  pendiente: ['confirmado', 'cancelado'],
  confirmado: [],
  cancelado: [],
};

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export class Order {
  private constructor(
    public readonly id: string,
    public readonly usuarioId: string,
    private _items: OrderItem[],
    public estado: OrderStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  get items(): OrderItem[] {
    return [...this._items];
  }

  get subtotal(): number {
    return roundCurrency(
      this._items.reduce((sum, item) => sum + item.subtotal, 0),
    );
  }

  get total(): number {
    return this.subtotal;
  }

  static create(data: OrderData): Order {
    if (!data.usuarioId.trim()) {
      throw new InvalidOrderError('El pedido debe estar asociado a un usuario.');
    }

    if (!ORDER_STATUSES.includes(data.estado)) {
      throw new InvalidOrderError('El estado del pedido no es válido.');
    }

    if (data.items.length === 0) {
      throw new InvalidOrderError(
        'No es posible crear un pedido sin productos.',
      );
    }

    const items = data.items.map((item) => OrderItem.create(item));
    const productoIds = new Set(items.map((item) => item.productoId));

    if (productoIds.size !== items.length) {
      throw new InvalidOrderError(
        'El pedido no puede contener el mismo producto más de una vez.',
      );
    }

    return new Order(
      data.id,
      data.usuarioId.trim(),
      items,
      data.estado,
      data.createdAt,
      data.updatedAt,
    );
  }

  toJSON() {
    return {
      id: this.id,
      usuarioId: this.usuarioId,
      items: this._items.map((item) => ({
        ...item.toData(),
        subtotal: item.subtotal,
      })),
      subtotal: this.subtotal,
      total: this.total,
      estado: this.estado,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromCart(cart: Cart, id = '', now = new Date()): Order {
    if (cart.items.length === 0) {
      throw new InvalidOrderError(
        'Agrega productos al carrito antes de confirmar el pedido.',
      );
    }

    return Order.create({
      id,
      usuarioId: cart.usuarioId,
      items: cart.items.map((item) => item.toData()),
      estado: 'pendiente',
      createdAt: now,
      updatedAt: now,
    });
  }

  isOwnedBy(usuarioId: string): boolean {
    return this.usuarioId === usuarioId;
  }

  changeStatus(next: OrderStatus): void {
    if (!ALLOWED_TRANSITIONS[this.estado].includes(next)) {
      throw new InvalidOrderStatusError(
        `No se puede cambiar el pedido de "${this.estado}" a "${next}".`,
      );
    }

    this.estado = next;
    this.updatedAt = new Date();
  }
}

export class InvalidOrderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidOrderError';
  }
}

export class InvalidOrderStatusError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidOrderStatusError';
  }
}

export class OrderNotFoundError extends Error {
  constructor(message = 'Pedido no encontrado.') {
    super(message);
    this.name = 'OrderNotFoundError';
  }
}

export class OrderAccessDeniedError extends Error {
  constructor(message = 'Este pedido no pertenece a tu sesión.') {
    super(message);
    this.name = 'OrderAccessDeniedError';
  }
}
