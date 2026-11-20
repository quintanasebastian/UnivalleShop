import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  Cart,
  CartNotFoundError,
} from '../../domain/entities/cart.entity.js';
import type { CartData } from '../../domain/entities/cart.entity.js';
import type { OrderItemData } from '../../domain/entities/order-item.entity.js';
import type { CartRepository } from '../../domain/ports/repositories/cart.repository.js';
import {
  CartSchema,
  CartMongoDocument,
} from '../schemas/cart.schema.js';
import type { OrderItemSchema } from '../schemas/order-item.schema.js';

@Injectable()
export class CartMongoRepositoryAdapter implements CartRepository {
  constructor(
    @InjectModel(CartSchema.name)
    private readonly cartModel: Model<CartSchema>,
  ) {}

  private toItemData(item: OrderItemSchema): OrderItemData {
    return {
      productoId: item.productoId,
      nombre: item.nombre,
      precioUnitario: item.precioUnitario,
      cantidad: item.cantidad,
    };
  }

  private toDomain(document: CartMongoDocument): Cart {
    const data: CartData = {
      id: document._id.toString(),
      usuarioId: document.usuarioId,
      items: document.items.map((item) => this.toItemData(item)),
      estado: document.estado,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };

    return Cart.create(data);
  }

  private toPersistence(cart: Cart) {
    return {
      usuarioId: cart.usuarioId,
      items: cart.items.map((item) => ({
        ...item.toData(),
        subtotal: item.subtotal,
      })),
      estado: cart.estado,
    };
  }

  async findActiveByUser(usuarioId: string): Promise<Cart | null> {
    const document = await this.cartModel
      .findOne({ usuarioId, estado: 'activo' })
      .exec();

    return document ? this.toDomain(document as CartMongoDocument) : null;
  }

  async findById(id: string): Promise<Cart | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const document = await this.cartModel.findById(id).exec();

    return document ? this.toDomain(document as CartMongoDocument) : null;
  }

  async save(cart: Cart): Promise<Cart> {
    const cartData = this.toPersistence(cart);
    let document: CartMongoDocument;

    if (cart.id) {
      if (!Types.ObjectId.isValid(cart.id)) {
        throw new CartNotFoundError();
      }

      const updatedDocument = await this.cartModel
        .findByIdAndUpdate(cart.id, { $set: cartData }, {
          new: true,
          runValidators: true,
        })
        .exec();

      if (!updatedDocument) {
        throw new CartNotFoundError();
      }

      document = updatedDocument as CartMongoDocument;
    } else {
      document = (await new this.cartModel(cartData).save()) as CartMongoDocument;
    }

    return this.toDomain(document);
  }

  async delete(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new CartNotFoundError();
    }

    const document = await this.cartModel.findByIdAndDelete(id).exec();

    if (!document) {
      throw new CartNotFoundError();
    }
  }
}
