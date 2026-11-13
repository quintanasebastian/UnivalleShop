import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  ProductSchema,
  ProductMongoSchema,
} from './infrastructure/schemas/product.schema.js';

import { ProductMongoRepositoryAdapter } from './infrastructure/adapters/product-mongo.repository.adapter.js';

import { PRODUCT_REPOSITORY } from './domain/ports/repositories/product.repository.js';

import { CreateProductUseCase } from './application/use-cases/create-product.use-case.js';
import { FindAllProductsUseCase } from './application/use-cases/find-all-products.use-case.js';
import { FindProductByIdUseCase } from './application/use-cases/find-product-by-id.use-case.js';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case.js';
import { DeleteProductUseCase } from './application/use-cases/delete-product.use-case.js';

import { ProductsController } from './presentation/controllers/products.controller.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProductSchema.name,
        schema: ProductMongoSchema,
      },
    ]),
  ],

  controllers: [ProductsController],

  providers: [
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductMongoRepositoryAdapter,
    },

    CreateProductUseCase,
    FindAllProductsUseCase,
    FindProductByIdUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
  ],

  exports: [PRODUCT_REPOSITORY],
})
export class CatalogModule {}
