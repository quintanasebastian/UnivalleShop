import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrdersModule } from './modules/orders/orders.module.js';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ??
        'mongodb://localhost:27019/univalle_shop_orders',
    ),

    OrdersModule,
  ],
})
export class AppModule {}
