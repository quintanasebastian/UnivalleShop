import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type SessionMongoDocument = HydratedDocument<SessionSchema>;

@Schema({
  timestamps: true,
  collection: 'sessions',
})
export class SessionSchema {
  /** Solo se guarda el hash SHA-256 del token, nunca el token en claro. */
  @Prop({ required: true, unique: true })
  tokenHash!: string;

  @Prop({ required: true, index: true })
  usuarioId!: string;

  /** Índice TTL: MongoDB borra la sesión automáticamente al vencer. */
  @Prop({ required: true, expires: 0 })
  expiresAt!: Date;
}

export const SessionMongoSchema = SchemaFactory.createForClass(SessionSchema);
