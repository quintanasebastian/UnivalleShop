import { Inject, Injectable } from '@nestjs/common';

import {
  Product,
  ProductAlreadyExistsError,
  ProductCategory,
} from '../../domain/entities/product.entity.js';

import { PRODUCT_REPOSITORY } from '../../domain/ports/repositories/product.repository.js';
import type { ProductRepository } from '../../domain/ports/repositories/product.repository.js';

export interface CreateProductInput {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: ProductCategory;
  imagen: string;
}

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(input: CreateProductInput): Promise<Product> {
    const nombre = input.nombre.trim();

    const existingProduct = await this.productRepository.findByName(nombre);

    if (existingProduct) {
      throw new ProductAlreadyExistsError(
        `Ya existe un producto con el nombre "${nombre}".`,
      );
    }

    const now = new Date();

    const product = Product.create({
      id: '',
      nombre,
      descripcion: input.descripcion,
      precio: input.precio,
      stock: input.stock,
      categoria: input.categoria,
      imagen: input.imagen,
      estado: true,
      createdAt: now,
      updatedAt: now,
    });

    return this.productRepository.save(product);
  }
}
