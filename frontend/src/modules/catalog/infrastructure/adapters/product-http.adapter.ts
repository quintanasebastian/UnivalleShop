import { request } from '../../../../shared/infrastructure/http-client';
import type { Product } from '../../domain/model/product.entity';
import type { ProductRepository } from '../../domain/ports/product.repository';

const productsPath = '/api/products';

export const productHttpAdapter: ProductRepository = {
  async getAll(category, signal) {
    const query = category ? `?categoria=${encodeURIComponent(category)}` : '';
    const products = await request<Product[]>(`${productsPath}${query}`, { signal });
    if (!Array.isArray(products)) throw new Error('La respuesta del catálogo no tiene el formato esperado.');
    return products;
  },
  getById(id, signal) {
    return request<Product>(`${productsPath}/${encodeURIComponent(id)}`, { signal });
  },
};
