import { Inject, Injectable } from '@nestjs/common';

import { ProductNotFoundError } from '../../domain/entities/product.entity.js';
import { PRODUCT_REPOSITORY } from '../../domain/ports/repositories/product.repository.js';
import type { ProductRepository } from '../../domain/ports/repositories/product.repository.js';

@Injectable()
export class RestoreProductStockUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: string, cantidad: number) {
    const updated = await this.productRepository.incrementStock(id, cantidad);

    if (!updated) {
      throw new ProductNotFoundError();
    }

    return updated;
  }
}
