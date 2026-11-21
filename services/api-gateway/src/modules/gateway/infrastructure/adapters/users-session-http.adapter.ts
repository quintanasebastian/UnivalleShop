import { Inject, Injectable } from '@nestjs/common';

import { ServiceUnavailableError } from '../../domain/errors/gateway.errors.js';
import type { Identity } from '../../domain/model/route.js';
import type { SessionVerifierPort } from '../../domain/ports/session-verifier.port.js';
import { GATEWAY_CONFIG } from '../config/gateway.config.js';
import type { GatewayConfig } from '../config/gateway.config.js';

/**
 * Valida la sesión preguntándole al servicio de usuarios (`GET /sesion`).
 * Así las sesiones cerradas o vencidas dejan de servir en toda la tienda.
 */
@Injectable()
export class UsersSessionHttpAdapter implements SessionVerifierPort {
  constructor(
    @Inject(GATEWAY_CONFIG)
    private readonly config: GatewayConfig,
  ) {}

  async verify(cookieHeader: string | undefined): Promise<Identity | null> {
    if (!cookieHeader) {
      return null;
    }

    let response: Response;

    try {
      response = await fetch(`${this.config.services.usuarios}/sesion`, {
        headers: {
          cookie: cookieHeader,
          ...(this.config.internalToken ? { 'x-internal-token': this.config.internalToken } : {}),
        },
        signal: AbortSignal.timeout(this.config.timeoutMs),
      });
    } catch {
      throw new ServiceUnavailableError('usuarios');
    }

    if (response.status === 401) {
      return null;
    }

    if (!response.ok) {
      throw new ServiceUnavailableError('usuarios');
    }

    const user = (await response.json()) as { id?: string; correo?: string };

    if (!user.id || !user.correo) {
      return null;
    }

    return { usuarioId: user.id, correo: user.correo };
  }
}
