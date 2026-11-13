import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CatalogModule } from './modules/catalog/catalog.module.js';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ??
        'mongodb://localhost:27017/univalle_shop_catalog',
    ),

    CatalogModule,
  ],
})
export class AppModule {}
