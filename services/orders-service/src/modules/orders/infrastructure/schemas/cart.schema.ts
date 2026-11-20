import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

import { CART_STATUSES } from '../../domain/entities/cart.entity.js';
import type { CartStatus } from '../../domain/entities/cart.entity.js';
import {
  OrderItemSchema,
  OrderItemMongoSchema,
} from './order-item.schema.js';

export type CartMongoDocument = HydratedDocument<CartSchema>;

@Schema({
  timestamps: true,
  collection: 'carts',
})
export class CartSchema {
  @Prop({ required: true, trim: true, index: true })
  usuarioId!: string;

  @Prop({ type: [OrderItemMongoSchema], default: [] })
  items!: OrderItemSchema[];

  @Prop({ required: true, enum: CART_STATUSES, default: 'activo' })
  estado!: CartStatus;

  createdAt!: Date;
  updatedAt!: Date;
}

export const CartMongoSchema = SchemaFactory.createForClass(CartSchema);

CartMongoSchema.index(
  { usuarioId: 1, estado: 1 },
  {
    unique: true,
    partialFilterExpression: { estado: 'activo' },
  },
);
