/**
 * Puerto de dominio para reservar/devolver stock en Catalog Service.
 * Orders solo conoce este contrato: la comunicación HTTP vive en el adaptador.
 */
export interface ProductStockPort {
  decreaseStock(productoId: string, cantidad: number): Promise<void>;

  restoreStock(productoId: string, cantidad: number): Promise<void>;
}

export const PRODUCT_STOCK_PORT = Symbol('PRODUCT_STOCK_PORT');
