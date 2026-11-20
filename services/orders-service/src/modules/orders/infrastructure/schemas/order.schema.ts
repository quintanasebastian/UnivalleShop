import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

import { ORDER_STATUSES } from '../../domain/entities/order.entity.js';
import type { OrderStatus } from '../../domain/entities/order.entity.js';
import {
  OrderItemSchema,
  OrderItemMongoSchema,
} from './order-item.schema.js';

export type OrderMongoDocument = HydratedDocument<OrderSchema>;

@Schema({
  timestamps: true,
  collection: 'orders',
})
export class OrderSchema {
  @Prop({ required: true, trim: true })
  usuarioId!: string;

  @Prop({ type: [OrderItemMongoSchema], default: [] })
  items!: OrderItemSchema[];

  @Prop({ required: true, min: 0 })
  subtotal!: number;

  @Prop({ required: true, min: 0 })
  total!: number;

  @Prop({ required: true, enum: ORDER_STATUSES, default: 'pendiente' })
  estado!: OrderStatus;

  createdAt!: Date;
  updatedAt!: Date;
}

export const OrderMongoSchema = SchemaFactory.createForClass(OrderSchema);

OrderMongoSchema.index({ usuarioId: 1, createdAt: -1 });
