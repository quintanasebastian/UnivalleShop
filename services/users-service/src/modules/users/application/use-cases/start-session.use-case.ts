import { Inject, Injectable } from '@nestjs/common';

import { Session } from '../../domain/entities/session.entity.js';
import { SESSION_REPOSITORY } from '../../domain/ports/repositories/session.repository.js';
import type { SessionRepository } from '../../domain/ports/repositories/session.repository.js';
import { TOKEN_GENERATOR } from '../../domain/ports/security/token-generator.port.js';
import type { TokenGeneratorPort } from '../../domain/ports/security/token-generator.port.js';

@Injectable()
export class StartSessionUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,

    @Inject(TOKEN_GENERATOR)
    private readonly tokenGenerator: TokenGeneratorPort,
  ) {}

  async execute(usuarioId: string): Promise<Session> {
    const session = Session.start(this.tokenGenerator.generate(), usuarioId);

    await this.sessionRepository.save(session);

    return session;
  }
}
