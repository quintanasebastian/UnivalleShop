/** El catálogo no pudo reservar el stock (sin existencias, producto inexistente, etc.). */
export class ProductStockError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProductStockError';
  }
}

/** No fue posible comunicarse con Catalog Service. */
export class CatalogUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CatalogUnavailableError';
  }
}
