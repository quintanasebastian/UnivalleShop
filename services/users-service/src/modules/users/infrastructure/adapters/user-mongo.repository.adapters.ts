import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  User,
  UserData,
  UpdateUserData,
} from '../../domain/entities/user-entity.js';

import { UserRepository } from '../../domain/ports/repositories/user.repository.js';

import {
  UserSchema,
  UserMongoDocument,
} from '../schemas/user.schema.js';

@Injectable()
export class UserMongoRepositoryAdapter implements UserRepository {
  constructor(
    @InjectModel(UserSchema.name)
    private readonly userModel: Model<UserSchema>,
  ) {}

  private toDomain(document: UserMongoDocument): User {
    const data: UserData = {
      id: document._id.toString(),
      nombres: document.nombres,
      apellidos: document.apellidos,
      correo: document.correo,
      passwordHash: document.passwordHash,
      tipoUsuario: document.tipoUsuario,
      telefono: document.telefono,
      direccion: document.direccion,
      estado: document.estado,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };

    return User.create(data);
  }

  async save(user: User): Promise<User> {
    const userData = {
      nombres: user.nombres,
      apellidos: user.apellidos,
      correo: user.correo,
      passwordHash: user.passwordHash,
      tipoUsuario: user.tipoUsuario,
      telefono: user.telefono,
      direccion: user.direccion,
      estado: user.estado,
    };

    let document: UserMongoDocument;

    if (user.id) {
      const updatedDocument = await this.userModel
        .findByIdAndUpdate(
          user.id,
          { $set: userData },
          { new: true, runValidators: true },
        )
        .exec();

      if (!updatedDocument) {
        throw new Error('No fue posible actualizar el usuario.');
      }

      document = updatedDocument as UserMongoDocument;
    } else {
      document = await new this.userModel(userData).save();
    }

    
    const savedDocument = await this.userModel
      .findById(document._id)
      .select('+passwordHash')
      .exec();

    if (!savedDocument) {
      throw new Error('No fue posible recuperar el usuario guardado.');
    }

    return this.toDomain(savedDocument as UserMongoDocument);
  }

  async findById(id: string): Promise<User | null> {
    const document = await this.userModel
      .findById(id)
      .select('+passwordHash')
      .exec();

    return document ? this.toDomain(document as UserMongoDocument) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const document = await this.userModel
      .findOne({ correo: email.toLowerCase() })
      .select('+passwordHash')
      .exec();

    return document ? this.toDomain(document as UserMongoDocument) : null;
  }

  async findAll(): Promise<User[]> {
    const documents = await this.userModel
      .find()
      .select('+passwordHash')
      .exec();

    return documents.map((document) =>
      this.toDomain(document as UserMongoDocument),
    );
  }

  async update(
    id: string,
    data: UpdateUserData,
  ): Promise<User | null> {
    const document = await this.userModel
      .findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true },
      )
      .select('+passwordHash')
      .exec();

    return document ? this.toDomain(document as UserMongoDocument) : null;
  }
}
