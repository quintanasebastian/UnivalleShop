export const PRODUCT_CATEGORIES = [
  'tecnologia',
  'libros',
  'papeleria',
  'ropa',
  'accesorios',
  'hogar',
  'otros',
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export interface ProductData {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: ProductCategory;
  imagen: string;
  estado: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateProductData {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  stock?: number;
  categoria?: ProductCategory;
  imagen?: string;
}

export class Product {
  private constructor(
    public readonly id: string,
    public nombre: string,
    public descripcion: string,
    public precio: number,
    public stock: number,
    public categoria: ProductCategory,
    public imagen: string,
    public estado: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(data: ProductData): Product {
    const product = new Product(
      data.id,
      data.nombre.trim(),
      data.descripcion.trim(),
      data.precio,
      data.stock,
      data.categoria,
      data.imagen.trim(),
      data.estado,
      data.createdAt,
      data.updatedAt,
    );

    product.validate();

    return product;
  }

  update(data: UpdateProductData): void {
    if (data.nombre !== undefined) {
      this.nombre = data.nombre.trim();
    }

    if (data.descripcion !== undefined) {
      this.descripcion = data.descripcion.trim();
    }

    if (data.precio !== undefined) {
      this.precio = data.precio;
    }

    if (data.stock !== undefined) {
      this.stock = data.stock;
    }

    if (data.categoria !== undefined) {
      this.categoria = data.categoria;
    }

    if (data.imagen !== undefined) {
      this.imagen = data.imagen.trim();
    }

    this.validate();
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.estado = false;
    this.updatedAt = new Date();
  }

  hasStock(quantity: number): boolean {
    return Number.isInteger(quantity) && quantity > 0 && this.stock >= quantity;
  }

  private validate(): void {
    if (!this.nombre || this.nombre.length < 2 || this.nombre.length > 120) {
      throw new InvalidProductError(
        'El nombre del producto debe tener entre 2 y 120 caracteres.',
      );
    }

    if (!this.descripcion || this.descripcion.length > 1000) {
      throw new InvalidProductError(
        'La descripción del producto es obligatoria y no puede superar los 1000 caracteres.',
      );
    }

    if (!Number.isFinite(this.precio) || this.precio < 0) {
      throw new InvalidProductError(
        'El precio del producto debe ser un número mayor o igual a cero.',
      );
    }

    if (!Number.isInteger(this.stock) || this.stock < 0) {
      throw new InvalidProductError(
        'El stock del producto debe ser un entero mayor o igual a cero.',
      );
    }

    if (!PRODUCT_CATEGORIES.includes(this.categoria)) {
      throw new InvalidProductError('La categoría del producto no es válida.');
    }

    if (!this.imagen || this.imagen.length > 2048) {
      throw new InvalidProductError(
        'La imagen del producto es obligatoria y no puede superar los 2048 caracteres.',
      );
    }
  }
}

export class InvalidProductError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidProductError';
  }
}

export class ProductNotFoundError extends Error {
  constructor(message = 'Producto no encontrado.') {
    super(message);
    this.name = 'ProductNotFoundError';
  }
}

export class ProductAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProductAlreadyExistsError';
  }
}
