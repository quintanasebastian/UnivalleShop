import type {
  Product,
  ProductCategory,
} from '../../entities/product.entity.js';

export interface ProductRepository {
  save(product: Product): Promise<Product>;

  findById(id: string): Promise<Product | null>;

  findByName(name: string): Promise<Product | null>;

  findAll(categoria?: ProductCategory): Promise<Product[]>;

  delete(id: string): Promise<void>;
}

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');
