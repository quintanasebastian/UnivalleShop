import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';

import {
  CartItemNotFoundError,
  CartNotFoundError,
  InvalidCartError,
} from '../domain/entities/cart.entity.js';
import {
  CatalogUnavailableError,
  ProductStockError,
} from '../domain/errors/catalog.errors.js';
import { InvalidOrderItemError } from '../domain/entities/order-item.entity.js';
import {
  InvalidOrderError,
  InvalidOrderStatusError,
  OrderAccessDeniedError,
  OrderNotFoundError,
} from '../domain/entities/order.entity.js';

export function mapDomainErrorToHttp(error: unknown): never {
  if (
    error instanceof CartNotFoundError ||
    error instanceof CartItemNotFoundError ||
    error instanceof OrderNotFoundError
  ) {
    throw new NotFoundException(error.message);
  }

  if (error instanceof OrderAccessDeniedError) {
    throw new ForbiddenException(error.message);
  }

  if (error instanceof ProductStockError) {
    throw new ConflictException(error.message);
  }

  if (error instanceof CatalogUnavailableError) {
    throw new ServiceUnavailableException(error.message);
  }

  if (
    error instanceof InvalidCartError ||
    error instanceof InvalidOrderItemError ||
    error instanceof InvalidOrderError ||
    error instanceof InvalidOrderStatusError
  ) {
    throw new BadRequestException(error.message);
  }

  throw error;
}
