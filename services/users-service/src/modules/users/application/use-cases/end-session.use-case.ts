import { Inject, Injectable } from '@nestjs/common';

import { SESSION_REPOSITORY } from '../../domain/ports/repositories/session.repository.js';
import type { SessionRepository } from '../../domain/ports/repositories/session.repository.js';

/** Cierra la sesión: el token deja de servir en todos los microservicios. */
@Injectable()
export class EndSessionUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(token: string | null): Promise<void> {
    if (token) {
      await this.sessionRepository.deleteByToken(token);
    }
  }
}
