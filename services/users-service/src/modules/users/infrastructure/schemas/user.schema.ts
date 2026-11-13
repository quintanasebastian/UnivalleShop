import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import type { UserType } from '../../domain/entities/user-entity.js';

export type UserMongoDocument = HydratedDocument<UserSchema>;

@Schema({
  timestamps: true,
  collection: 'users',
})
export class UserSchema {
  @Prop({ required: true, trim: true })
  nombres!: string;

  @Prop({ required: true, trim: true })
  apellidos!: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@correounivalle\.edu\.co$/,
  })
  correo!: string;

  @Prop({ required: true, select: false })
  passwordHash!: string;

  @Prop({
    required: true,
    enum: ['estudiante', 'docente', 'administrativo'],
  })
  tipoUsuario!: UserType;

  @Prop()
  telefono?: string;

  @Prop()
  direccion?: string;

  @Prop({ default: true })
  estado!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}

export const UserMongoSchema = SchemaFactory.createForClass(UserSchema);
