import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { MAX_ITEM_QUANTITY } from '../../domain/entities/order-item.entity.js';

@Schema({ _id: false })
export class OrderItemSchema {
  @Prop({ required: true, trim: true, maxlength: 64 })
  productoId!: string;

  @Prop({ required: true, trim: true, maxlength: 120 })
  nombre!: string;

  @Prop({ required: true, min: 0 })
  precioUnitario!: number;

  @Prop({ required: true, min: 1, max: MAX_ITEM_QUANTITY })
  cantidad!: number;

  @Prop({ required: true, min: 0 })
  subtotal!: number;
}

export const OrderItemMongoSchema = SchemaFactory.createForClass(OrderItemSchema);
