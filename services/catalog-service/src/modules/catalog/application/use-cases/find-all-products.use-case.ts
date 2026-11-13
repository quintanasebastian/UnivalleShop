import { Inject, Injectable } from '@nestjs/common';

import type { ProductCategory } from '../../domain/entities/product.entity.js';

import { PRODUCT_REPOSITORY } from '../../domain/ports/repositories/product.repository.js';
import type { ProductRepository } from '../../domain/ports/repositories/product.repository.js';

export interface FindAllProductsInput {
  categoria?: ProductCategory;
}

@Injectable()
export class FindAllProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(input: FindAllProductsInput = {}) {
    return this.productRepository.findAll(input.categoria);
  }
}
