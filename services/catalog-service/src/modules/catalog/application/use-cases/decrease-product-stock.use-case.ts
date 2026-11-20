import { Inject, Injectable } from '@nestjs/common';

import {
  InsufficientStockError,
  ProductNotFoundError,
} from '../../domain/entities/product.entity.js';
import { PRODUCT_REPOSITORY } from '../../domain/ports/repositories/product.repository.js';
import type { ProductRepository } from '../../domain/ports/repositories/product.repository.js';

@Injectable()
export class DecreaseProductStockUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: string, cantidad: number) {
    const updated = await this.productRepository.decrementStock(id, cantidad);

    if (updated) {
      return updated;
    }

    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new ProductNotFoundError();
    }

    // La entidad define la regla de negocio y produce el error de dominio claro.
    product.ensureStock(cantidad);

    // Otra petición pudo haber liberado stock entre ambas operaciones: se reintenta una vez.
    const retried = await this.productRepository.decrementStock(id, cantidad);

    if (retried) {
      return retried;
    }

    throw new InsufficientStockError(
      `No fue posible descontar ${cantidad} unidades de "${product.nombre}". Inténtalo de nuevo.`,
    );
  }
}
