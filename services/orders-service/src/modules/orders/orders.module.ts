import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AddItemToCartUseCase } from './application/use-cases/add-item-to-cart.use-case.js';
import { ChangeOrderStatusUseCase } from './application/use-cases/change-order-status.use-case.js';
import { CheckoutUseCase } from './application/use-cases/checkout.use-case.js';
import { FindOrderByIdUseCase } from './application/use-cases/find-order-by-id.use-case.js';
import { FindOrdersByUserUseCase } from './application/use-cases/find-orders-by-user.use-case.js';
import { GetCartUseCase } from './application/use-cases/get-cart.use-case.js';
import { RemoveCartItemUseCase } from './application/use-cases/remove-cart-item.use-case.js';
import { UpdateCartItemUseCase } from './application/use-cases/update-cart-item.use-case.js';
import { CART_REPOSITORY } from './domain/ports/repositories/cart.repository.js';
import { ORDER_REPOSITORY } from './domain/ports/repositories/order.repository.js';
import { SESSION_READER } from './domain/ports/security/session-reader.port.js';
import { PRODUCT_STOCK_PORT } from './domain/ports/services/product-stock.port.js';
import { CartMongoRepositoryAdapter } from './infrastructure/adapters/cart-mongo.repository.adapter.js';
import { CatalogStockAdapter } from './infrastructure/adapters/catalog-stock.adapter.js';
import { OrderMongoRepositoryAdapter } from './infrastructure/adapters/order-mongo.repository.adapter.js';
import { GatewayIdentityAdapter } from './infrastructure/adapters/gateway-identity.adapter.js';
import { CartSchema, CartMongoSchema } from './infrastructure/schemas/cart.schema.js';
import {
  OrderSchema,
  OrderMongoSchema,
} from './infrastructure/schemas/order.schema.js';
import { CartController } from './presentation/controllers/cart.controller.js';
import { OrdersController } from './presentation/controllers/orders.controller.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CartSchema.name, schema: CartMongoSchema },
      { name: OrderSchema.name, schema: OrderMongoSchema },
    ]),
  ],

  controllers: [CartController, OrdersController],

  providers: [
    {
      provide: CART_REPOSITORY,
      useClass: CartMongoRepositoryAdapter,
    },
    {
      provide: ORDER_REPOSITORY,
      useClass: OrderMongoRepositoryAdapter,
    },
    {
      provide: SESSION_READER,
      useClass: GatewayIdentityAdapter,
    },
    {
      provide: PRODUCT_STOCK_PORT,
      useClass: CatalogStockAdapter,
    },

    GetCartUseCase,
    AddItemToCartUseCase,
    UpdateCartItemUseCase,
    RemoveCartItemUseCase,
    CheckoutUseCase,
    FindOrdersByUserUseCase,
    FindOrderByIdUseCase,
    ChangeOrderStatusUseCase,
  ],

  exports: [CART_REPOSITORY, ORDER_REPOSITORY],
})
export class OrdersModule {}
