import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  InvalidOrderError,
  OrderNotFoundError,
} from '../../domain/entities/order.entity.js';
import { Order } from '../../domain/entities/order.entity.js';
import type { OrderData } from '../../domain/entities/order.entity.js';
import type { OrderItemData } from '../../domain/entities/order-item.entity.js';
import type { OrderRepository } from '../../domain/ports/repositories/order.repository.js';
import {
  OrderSchema,
  OrderMongoDocument,
} from '../schemas/order.schema.js';
import type { OrderItemSchema } from '../schemas/order-item.schema.js';

@Injectable()
export class OrderMongoRepositoryAdapter implements OrderRepository {
  constructor(
    @InjectModel(OrderSchema.name)
    private readonly orderModel: Model<OrderSchema>,
  ) {}

  private toItemData(item: OrderItemSchema): OrderItemData {
    return {
      productoId: item.productoId,
      nombre: item.nombre,
      precioUnitario: item.precioUnitario,
      cantidad: item.cantidad,
    };
  }

  private toDomain(document: OrderMongoDocument): Order {
    const data: OrderData = {
      id: document._id.toString(),
      usuarioId: document.usuarioId,
      items: document.items.map((item) => this.toItemData(item)),
      estado: document.estado,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };

    const order = Order.create(data);
    const subtotal = order.subtotal;
    const total = order.total;

    if (subtotal !== document.subtotal || total !== document.total) {
      throw new InvalidOrderError('Los totales guardados del pedido no son válidos.');
    }

    return order;
  }

  private toPersistence(order: Order) {
    return {
      usuarioId: order.usuarioId,
      items: order.items.map((item) => ({
        ...item.toData(),
        subtotal: item.subtotal,
      })),
      subtotal: order.subtotal,
      total: order.total,
      estado: order.estado,
    };
  }

  async save(order: Order): Promise<Order> {
    const orderData = this.toPersistence(order);
    let document: OrderMongoDocument;

    if (order.id) {
      if (!Types.ObjectId.isValid(order.id)) {
        throw new OrderNotFoundError();
      }

      const updatedDocument = await this.orderModel
        .findByIdAndUpdate(order.id, { $set: orderData }, {
          new: true,
          runValidators: true,
        })
        .exec();

      if (!updatedDocument) {
        throw new OrderNotFoundError();
      }

      document = updatedDocument as OrderMongoDocument;
    } else {
      document = (await new this.orderModel(orderData).save()) as OrderMongoDocument;
    }

    return this.toDomain(document);
  }

  async findById(id: string): Promise<Order | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const document = await this.orderModel.findById(id).exec();

    return document ? this.toDomain(document as OrderMongoDocument) : null;
  }

  async findByUser(usuarioId: string): Promise<Order[]> {
    const documents = await this.orderModel
      .find({ usuarioId })
      .sort({ createdAt: -1 })
      .exec();

    return documents.map((document) =>
      this.toDomain(document as OrderMongoDocument),
    );
  }

  async delete(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      return;
    }

    // Idempotente: porque se usa en compensación, no falla si ya no existe.
    await this.orderModel.deleteOne({ _id: new Types.ObjectId(id) }).exec();
  }
}
