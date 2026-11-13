import { Inject, Injectable } from '@nestjs/common';

import {
  ProductAlreadyExistsError,
  ProductNotFoundError,
  UpdateProductData,
} from '../../domain/entities/product.entity.js';

import { PRODUCT_REPOSITORY } from '../../domain/ports/repositories/product.repository.js';
import type { ProductRepository } from '../../domain/ports/repositories/product.repository.js';

export type UpdateProductInput = UpdateProductData;

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: string, input: UpdateProductInput) {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new ProductNotFoundError();
    }

    if (
      input.nombre !== undefined &&
      input.nombre.trim().toLowerCase() !== product.nombre.toLowerCase()
    ) {
      const existingProduct = await this.productRepository.findByName(
        input.nombre.trim(),
      );

      if (existingProduct) {
        throw new ProductAlreadyExistsError(
          `Ya existe un producto con el nombre "${input.nombre.trim()}".`,
        );
      }
    }

    product.update(input);

    return this.productRepository.save(product);
  }
}
