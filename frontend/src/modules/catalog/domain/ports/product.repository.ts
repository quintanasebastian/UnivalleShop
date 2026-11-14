import type { Product } from '../model/product.entity';

export interface ProductRepository {
  getAll(category: string, signal?: AbortSignal): Promise<Product[]>;
  getById(id: string, signal?: AbortSignal): Promise<Product>;
}
