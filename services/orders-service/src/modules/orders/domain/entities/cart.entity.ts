import { OrderItem } from './order-item.entity.js';
import type { OrderItemData } from './order-item.entity.js';

export const MAX_CART_ITEMS = 30;
export const CART_STATUSES = ['activo', 'finalizado'] as const;

export type CartStatus = (typeof CART_STATUSES)[number];

export interface CartData {
  id: string;
  usuarioId: string;
  items: OrderItemData[];
  estado: CartStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Cart {
  private constructor(
    public readonly id: string,
    public readonly usuarioId: string,
    private _items: OrderItem[],
    public readonly estado: CartStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  get items(): OrderItem[] {
    return [...this._items];
  }

  get subtotal(): number {
    return Math.round((this._items.reduce((sum, item) => sum + item.subtotal, 0) + Number.EPSILON) * 100) / 100;
  }

  static create(data: CartData): Cart {
    if (!data.usuarioId.trim()) {
      throw new InvalidCartError('El carrito debe estar asociado a un usuario.');
    }

    if (!CART_STATUSES.includes(data.estado)) {
      throw new InvalidCartError('El estado del carrito no es válido.');
    }

    if (data.items.length > MAX_CART_ITEMS) {
      throw new InvalidCartError(
        `El carrito no puede tener más de ${MAX_CART_ITEMS} productos diferentes.`,
      );
    }

    const items = data.items.map((item) => OrderItem.create(item));
    const productoIds = new Set(items.map((item) => item.productoId));

    if (productoIds.size !== items.length) {
      throw new InvalidCartError(
        'El carrito no puede contener el mismo producto más de una vez.',
      );
    }

    return new Cart(
      data.id,
      data.usuarioId.trim(),
      items,
      data.estado,
      data.createdAt,
      data.updatedAt,
    );
  }

  static empty(usuarioId: string, now = new Date()): Cart {
    return Cart.create({
      id: '',
      usuarioId,
      items: [],
      estado: 'activo',
      createdAt: now,
      updatedAt: now,
    });
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
      estado: this.estado,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  addItem(item: OrderItem): void {
    const index = this._items.findIndex(
      (current) => current.productoId === item.productoId,
    );

    if (index === -1) {
      if (this._items.length >= MAX_CART_ITEMS) {
        throw new InvalidCartError(
          `El carrito no puede tener más de ${MAX_CART_ITEMS} productos diferentes.`,
        );
      }

      this._items.push(item);
    } else {
      this._items[index] = this._items[index].withQuantity(
        this._items[index].cantidad + item.cantidad,
      );
    }

    this.updatedAt = new Date();
  }

  updateQuantity(productoId: string, cantidad: number): void {
    const index = this._items.findIndex(
      (item) => item.productoId === productoId,
    );

    if (index === -1) {
      throw new CartItemNotFoundError();
    }

    this._items[index] = this._items[index].withQuantity(cantidad);
    this.updatedAt = new Date();
  }

  removeItem(productoId: string): void {
    const length = this._items.length;
    this._items = this._items.filter(
      (item) => item.productoId !== productoId,
    );

    if (this._items.length === length) {
      throw new CartItemNotFoundError();
    }

    this.updatedAt = new Date();
  }
}

export class InvalidCartError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidCartError';
  }
}

export class CartNotFoundError extends Error {
  constructor(message = 'No tienes un carrito activo.') {
    super(message);
    this.name = 'CartNotFoundError';
  }
}

export class CartItemNotFoundError extends Error {
  constructor(message = 'El producto no está en el carrito.') {
    super(message);
    this.name = 'CartItemNotFoundError';
  }
}

