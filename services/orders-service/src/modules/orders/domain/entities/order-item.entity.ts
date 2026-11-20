export const MAX_ITEM_QUANTITY = 20;

export interface OrderItemData {
  productoId: string;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
}

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export class OrderItem {
  private constructor(
    public readonly productoId: string,
    public readonly nombre: string,
    public readonly precioUnitario: number,
    public readonly cantidad: number,
  ) {}

  static create(data: OrderItemData): OrderItem {
    const cents = data.precioUnitario * 100;

    if (!Number.isFinite(cents) || Math.abs(cents - Math.round(cents)) > 1e-6) {
      throw new InvalidOrderItemError(
        'El precio unitario debe tener máximo dos decimales.',
      );
    }

    const item = new OrderItem(
      data.productoId.trim(),
      data.nombre.trim(),
      roundCurrency(data.precioUnitario),
      data.cantidad,
    );

    item.validate();

    return item;
  }

  get subtotal(): number {
    return roundCurrency(this.precioUnitario * this.cantidad);
  }

  withQuantity(cantidad: number): OrderItem {
    return OrderItem.create({ ...this.toData(), cantidad });
  }

  toData(): OrderItemData {
    return {
      productoId: this.productoId,
      nombre: this.nombre,
      precioUnitario: this.precioUnitario,
      cantidad: this.cantidad,
    };
  }

  private validate(): void {
    if (!this.productoId || this.productoId.length > 64) {
      throw new InvalidOrderItemError('El identificador del producto no es válido.');
    }

    if (this.nombre.length < 2 || this.nombre.length > 120) {
      throw new InvalidOrderItemError(
        'El nombre del producto debe tener entre 2 y 120 caracteres.',
      );
    }

    if (!Number.isFinite(this.precioUnitario) || this.precioUnitario < 0) {
      throw new InvalidOrderItemError(
        'El precio unitario debe ser mayor o igual a cero.',
      );
    }

    if (
      !Number.isInteger(this.cantidad) ||
      this.cantidad < 1 ||
      this.cantidad > MAX_ITEM_QUANTITY
    ) {
      throw new InvalidOrderItemError(
        `La cantidad debe ser un entero entre 1 y ${MAX_ITEM_QUANTITY}.`,
      );
    }
  }
}

export class InvalidOrderItemError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidOrderItemError';
  }
}
