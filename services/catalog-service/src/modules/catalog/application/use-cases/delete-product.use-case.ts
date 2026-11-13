import { Inject, Injectable } from '@nestjs/common';

import { ProductNotFoundError } from '../../domain/entities/product.entity.js';

import { PRODUCT_REPOSITORY } from '../../domain/ports/repositories/product.repository.js';
import type { ProductRepository } from '../../domain/ports/repositories/product.repository.js';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new ProductNotFoundError();
    }

    await this.productRepository.delete(id);
  }
}
