import type {
  Product,
  ProductCategory,
} from '../../entities/product.entity.js';

export interface ProductRepository {
  save(product: Product): Promise<Product>;

  findById(id: string): Promise<Product | null>;

  findByName(name: string): Promise<Product | null>;

  findAll(categoria?: ProductCategory): Promise<Product[]>;

  /**
   * Descuenta `cantidad` de forma atómica solo si hay stock suficiente.
   * Devuelve null si el producto no existe o si el stock es menor a `cantidad`.
   */
  decrementStock(id: string, cantidad: number): Promise<Product | null>;

  /** Devuelve `cantidad` al stock. Devuelve null si el producto no existe. */
  incrementStock(id: string, cantidad: number): Promise<Product | null>;

  delete(id: string): Promise<void>;
}

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');
