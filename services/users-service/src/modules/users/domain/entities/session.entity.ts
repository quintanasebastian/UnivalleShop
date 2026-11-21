/** Duración de una sesión: 8 horas. */
export const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

export interface SessionData {
  token: string;
  usuarioId: string;
  expiresAt: Date;
}

export class InvalidSessionError extends Error {
  constructor() {
    super('No hay una sesión activa.');
  }
}

/**
 * Sesión de un usuario. El token es opaco: el dominio no sabe cómo se
 * genera ni cómo se guarda (eso lo resuelven los adaptadores).
 */
export class Session {
  private constructor(
    public readonly token: string,
    public readonly usuarioId: string,
    public readonly expiresAt: Date,
  ) {}

  static start(token: string, usuarioId: string, now = new Date()): Session {
    if (!token || !usuarioId) {
      throw new InvalidSessionError();
    }

    return new Session(
      token,
      usuarioId,
      new Date(now.getTime() + SESSION_DURATION_MS),
    );
  }

  static restore(data: SessionData): Session {
    return new Session(data.token, data.usuarioId, data.expiresAt);
  }

  isActive(now = new Date()): boolean {
    return this.expiresAt.getTime() > now.getTime();
  }

  secondsRemaining(now = new Date()): number {
    return Math.max(0, Math.floor((this.expiresAt.getTime() - now.getTime()) / 1000));
  }
}
