import type { Session } from '../../entities/session.entity.js';

export interface SessionRepository {
  save(session: Session): Promise<void>;
  findByToken(token: string): Promise<Session | null>;
  deleteByToken(token: string): Promise<void>;
}

export const SESSION_REPOSITORY = Symbol('SESSION_REPOSITORY');
