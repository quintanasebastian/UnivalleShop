import type { ProductRepository } from '../domain/ports/product.repository';

export function getProducts(repository: ProductRepository, category: string, signal?: AbortSignal) {
  return repository.getAll(category, signal);
}

export function getProductDetail(repository: ProductRepository, id: string, signal?: AbortSignal) {
  return repository.getById(id, signal);
}
