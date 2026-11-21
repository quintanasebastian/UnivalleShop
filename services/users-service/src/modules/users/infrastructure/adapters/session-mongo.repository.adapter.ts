import { createHash } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Session } from '../../domain/entities/session.entity.js';
import type { SessionRepository } from '../../domain/ports/repositories/session.repository.js';
import { SessionSchema } from '../schemas/session.schema.js';

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

@Injectable()
export class SessionMongoRepositoryAdapter implements SessionRepository {
  constructor(
    @InjectModel(SessionSchema.name)
    private readonly sessionModel: Model<SessionSchema>,
  ) {}

  async save(session: Session): Promise<void> {
    await this.sessionModel.create({
      tokenHash: hashToken(session.token),
      usuarioId: session.usuarioId,
      expiresAt: session.expiresAt,
    });
  }

  async findByToken(token: string): Promise<Session | null> {
    const document = await this.sessionModel
      .findOne({ tokenHash: hashToken(token) })
      .lean();

    if (!document) {
      return null;
    }

    return Session.restore({
      token,
      usuarioId: document.usuarioId,
      expiresAt: document.expiresAt,
    });
  }

  async deleteByToken(token: string): Promise<void> {
    await this.sessionModel.deleteOne({ tokenHash: hashToken(token) });
  }
}
