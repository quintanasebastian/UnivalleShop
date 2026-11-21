import { Inject, Injectable } from '@nestjs/common';

import { InvalidSessionError } from '../../domain/entities/session.entity.js';
import type { User } from '../../domain/entities/user-entity.js';
import { SESSION_REPOSITORY } from '../../domain/ports/repositories/session.repository.js';
import type { SessionRepository } from '../../domain/ports/repositories/session.repository.js';
import { USER_REPOSITORY } from '../../domain/ports/repositories/user.repository.js';
import type { UserRepository } from '../../domain/ports/repositories/user.repository.js';

/**
 * Comprueba que el token pertenezca a una sesión vigente (no cerrada ni
 * vencida) de un usuario activo. Lo usa el API Gateway en cada solicitud.
 */
@Injectable()
export class ValidateSessionUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,

    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(token: string | null): Promise<User> {
    if (!token) {
      throw new InvalidSessionError();
    }

    const session = await this.sessionRepository.findByToken(token);

    if (!session || !session.isActive()) {
      throw new InvalidSessionError();
    }

    const user = await this.userRepository.findById(session.usuarioId);

    if (!user || !user.estado) {
      throw new InvalidSessionError();
    }

    return user;
  }
}
