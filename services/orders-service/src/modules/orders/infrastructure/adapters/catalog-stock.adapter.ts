import { Injectable } from '@nestjs/common';

import {
  CatalogUnavailableError,
  ProductStockError,
} from '../../domain/errors/catalog.errors.js';
import type { ProductStockPort } from '../../domain/ports/services/product-stock.port.js';

const CATALOG_SERVICE_URL = (
  process.env.CATALOG_SERVICE_URL ?? 'http://localhost:3002'
).replace(/\/+$/, '');

const TIMEOUT_MS = Number(process.env.CATALOG_REQUEST_TIMEOUT_MS ?? 5000);

@Injectable()
export class CatalogStockAdapter implements ProductStockPort {
  async decreaseStock(productoId: string, cantidad: number): Promise<void> {
    await this.send(
      `/products/${encodeURIComponent(productoId)}/stock`,
      cantidad,
    );
  }

  async restoreStock(productoId: string, cantidad: number): Promise<void> {
    await this.send(
      `/products/${encodeURIComponent(productoId)}/stock/restore`,
      cantidad,
    );
  }

  private async send(path: string, cantidad: number): Promise<void> {
    let response: Awaited<ReturnType<typeof fetch>>;

    try {
      response = await fetch(`${CATALOG_SERVICE_URL}${path}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (error) {
      throw new CatalogUnavailableError(
        `No fue posible comunicarse con Catalog Service: ${String(error)}`,
      );
    }

    if (response.ok) {
      return;
    }

    const detalle = await this.readErrorMessage(response, response.status);

    if (response.status >= 500) {
      throw new CatalogUnavailableError(detalle);
    }

    throw new ProductStockError(detalle);
  }

  private async readErrorMessage(
    response: Awaited<ReturnType<typeof fetch>>,
    status: number,
  ): Promise<string> {
    try {
      const body = (await response.json()) as { message?: string | string[] };
      const message = Array.isArray(body.message)
        ? body.message.join(', ')
        : body.message;

      return message || `Catalog Service respondió HTTP ${status}.`;
    } catch {
      return `Catalog Service respondió HTTP ${status}.`;
    }
  }
}
