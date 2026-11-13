import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

import { PRODUCT_CATEGORIES } from '../../domain/entities/product.entity.js';
import type { ProductCategory } from '../../domain/entities/product.entity.js';

export type ProductMongoDocument = HydratedDocument<ProductSchema>;

@Schema({
  timestamps: true,
  collection: 'products',
})
export class ProductSchema {
  @Prop({ required: true, trim: true, maxlength: 120 })
  nombre!: string;

  @Prop({ required: true, trim: true, maxlength: 1000 })
  descripcion!: string;

  @Prop({ required: true, min: 0 })
  precio!: number;

  @Prop({ required: true, min: 0 })
  stock!: number;

  @Prop({ required: true, enum: PRODUCT_CATEGORIES })
  categoria!: ProductCategory;

  @Prop({ required: true, trim: true, maxlength: 2048 })
  imagen!: string;

  @Prop({ default: true })
  estado!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}

export const ProductMongoSchema = SchemaFactory.createForClass(ProductSchema);

ProductMongoSchema.index(
  { nombre: 1 },
  {
    unique: true,
    collation: { locale: 'es', strength: 2 },
  },
);
