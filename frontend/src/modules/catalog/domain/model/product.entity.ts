export interface Product {
  id?: string;
  _id?: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  precio: number;
  stock: number;
  imagen?: string;
  estado?: boolean;
  createdAt?: string;
}
