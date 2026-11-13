import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  Product,
  ProductNotFoundError,
} from '../../domain/entities/product.entity.js';

import type {
  ProductCategory,
  ProductData,
} from '../../domain/entities/product.entity.js';

import type { ProductRepository } from '../../domain/ports/repositories/product.repository.js';

import {
  ProductSchema,
  ProductMongoDocument,
} from '../schemas/product.schema.js';

@Injectable()
export class ProductMongoRepositoryAdapter implements ProductRepository {
  constructor(
    @InjectModel(ProductSchema.name)
    private readonly productModel: Model<ProductSchema>,
  ) {}

  private toDomain(document: ProductMongoDocument): Product {
    const data: ProductData = {
      id: document._id.toString(),
      nombre: document.nombre,
      descripcion: document.descripcion,
      precio: document.precio,
      stock: document.stock,
      categoria: document.categoria,
      imagen: document.imagen,
      estado: document.estado,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };

    return Product.create(data);
  }

  async save(product: Product): Promise<Product> {
    const productData = {
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      stock: product.stock,
      categoria: product.categoria,
      imagen: product.imagen,
      estado: product.estado,
    };

    let document: ProductMongoDocument;

    if (product.id) {
      if (!Types.ObjectId.isValid(product.id)) {
        throw new ProductNotFoundError();
      }

      const updatedDocument = await this.productModel
        .findByIdAndUpdate(
          product.id,
          { $set: productData },
          { new: true, runValidators: true },
        )
        .exec();

      if (!updatedDocument) {
        throw new ProductNotFoundError();
      }

      document = updatedDocument as ProductMongoDocument;
    } else {
      document = await new this.productModel(productData).save();
    }

    return this.toDomain(document);
  }

  async findById(id: string): Promise<Product | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const document = await this.productModel.findById(id).exec();

    return document ? this.toDomain(document as ProductMongoDocument) : null;
  }

  async findByName(nombre: string): Promise<Product | null> {
    const escapedName = nombre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const document = await this.productModel
      .findOne({
        nombre: {
          $regex: new RegExp(`^${escapedName}$`, 'i'),
        },
      })
      .collation({ locale: 'es', strength: 2 })
      .exec();

    return document ? this.toDomain(document as ProductMongoDocument) : null;
  }

  async findAll(categoria?: ProductCategory): Promise<Product[]> {
    const filter = categoria ? { categoria } : {};

    const documents = await this.productModel
      .find(filter)
      .sort({ createdAt: -1 })
      .exec();

    return documents.map((document) =>
      this.toDomain(document as ProductMongoDocument),
    );
  }

  async delete(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new ProductNotFoundError();
    }

    const document = await this.productModel.findByIdAndDelete(id).exec();

    if (!document) {
      throw new ProductNotFoundError();
    }
  }
}
