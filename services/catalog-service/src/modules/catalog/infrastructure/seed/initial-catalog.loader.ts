import { Injectable } from '@nestjs/common';
import type { OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case.js';
import { ProductAlreadyExistsError } from '../../domain/entities/product.entity.js';
import {
  PRODUCT_NAME_COLLATION,
  ProductSchema,
} from '../schemas/product.schema.js';
import { INITIAL_PRODUCTS } from './initial-products.js';

const SEED_ID = 'initial-products-v1';

@Injectable()
export class InitialCatalogLoader implements OnApplicationBootstrap {
  constructor(
    @InjectModel(ProductSchema.name)
    private readonly products: Model<ProductSchema>,
    private readonly createProduct: CreateProductUseCase,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (process.env.CATALOG_SEED_ENABLED !== 'true') return;

    await this.products.init();
    const seeds = this.products.db.collection<{ _id: string }>('catalog_seeds');
    if (await seeds.findOne({ _id: SEED_ID })) return;

    for (const product of INITIAL_PRODUCTS) {
      const existing = await this.products
        .exists({
          $or: [{ nombre: product.nombre }, { imagen: product.imagen }],
        })
        .collation(PRODUCT_NAME_COLLATION)
        .exec();

      if (existing) continue;

      try {
        await this.createProduct.execute(product);
      } catch (error) {
        const alreadyExists =
          error instanceof ProductAlreadyExistsError ||
          (error instanceof Error && 'code' in error && error.code === 11000);
        if (!alreadyExists) throw error;
      }
    }

    await seeds.updateOne(
      { _id: SEED_ID },
      { $setOnInsert: { _id: SEED_ID } },
      { upsert: true },
    );
  }
}
