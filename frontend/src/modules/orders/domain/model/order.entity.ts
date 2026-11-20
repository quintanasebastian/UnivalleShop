export type OrderStatus = 'pendiente' | 'confirmado' | 'cancelado';
export type CartStatus = 'activo' | 'finalizado';

export interface CartItem {
  productoId: string;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
}

export interface Cart {
  id: string;
  usuarioId: string;
  items: CartItem[];
  subtotal: number;
  estado: CartStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  id: string;
  usuarioId: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  estado: OrderStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddToCartInput {
  productoId: string;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
}
