import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import {
  InvalidProductError,
  PRODUCT_CATEGORIES,
  ProductAlreadyExistsError,
  ProductNotFoundError,
} from '../../domain/entities/product.entity.js';

import type { ProductCategory } from '../../domain/entities/product.entity.js';

import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case.js';
import { DeleteProductUseCase } from '../../application/use-cases/delete-product.use-case.js';
import { FindAllProductsUseCase } from '../../application/use-cases/find-all-products.use-case.js';
import { FindProductByIdUseCase } from '../../application/use-cases/find-product-by-id.use-case.js';
import { UpdateProductUseCase } from '../../application/use-cases/update-product.use-case.js';

import { CreateProductDto } from '../dto/create-product.dto.js';
import { UpdateProductDto } from '../dto/update-product.dto.js';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly findAllProductsUseCase: FindAllProductsUseCase,
    private readonly findProductByIdUseCase: FindProductByIdUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  private handleError(error: unknown): never {
    if (error instanceof ProductNotFoundError) {
      throw new NotFoundException(error.message);
    }

    if (error instanceof ProductAlreadyExistsError) {
      throw new ConflictException(error.message);
    }

    if (error instanceof InvalidProductError) {
      throw new BadRequestException(error.message);
    }

    throw error;
  }

  private assertCategory(
    categoria: string,
  ): asserts categoria is ProductCategory {
    if (!(PRODUCT_CATEGORIES as readonly string[]).includes(categoria)) {
      throw new BadRequestException(
        `La categoría "${categoria}" no es válida.`,
      );
    }
  }

  @Post()
  async create(@Body() dto: CreateProductDto) {
    try {
      return await this.createProductUseCase.execute(dto);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Get()
  async findAll(@Query('categoria') categoria?: string) {
    if (!categoria) {
      return this.findAllProductsUseCase.execute();
    }

    this.assertCategory(categoria);

    return this.findAllProductsUseCase.execute({ categoria });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      return await this.findProductByIdUseCase.execute(id);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    try {
      return await this.updateProductUseCase.execute(id, dto);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.deleteProductUseCase.execute(id);
    } catch (error) {
      this.handleError(error);
    }
  }
}
