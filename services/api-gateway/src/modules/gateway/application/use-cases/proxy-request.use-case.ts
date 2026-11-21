import { Inject, Injectable } from '@nestjs/common';

import {
  ForbiddenError,
  RouteNotFoundError,
  UnauthenticatedError,
} from '../../domain/errors/gateway.errors.js';
import { resolveRoute } from '../../domain/model/route-table.js';
import type { HttpMethod, Identity } from '../../domain/model/route.js';
import { ADMIN_DIRECTORY } from '../../domain/ports/admin-directory.port.js';
import type { AdminDirectoryPort } from '../../domain/ports/admin-directory.port.js';
import { SESSION_VERIFIER } from '../../domain/ports/session-verifier.port.js';
import type { SessionVerifierPort } from '../../domain/ports/session-verifier.port.js';
import { UPSTREAM } from '../../domain/ports/upstream.port.js';
import type { UpstreamPort, UpstreamResponse } from '../../domain/ports/upstream.port.js';
import { evaluateAccess } from '../../domain/services/access-policy.js';

export interface GatewayRequest {
  method: string;
  path: string;
  /** Query string original, con el signo `?` incluido (o vacío). */
  query: string;
  cookie?: string;
  body?: string;
  contentType?: string;
}

/**
 * Punto de entrada único: resuelve la ruta, valida la sesión, aplica la
 * política de acceso y reenvía la solicitud al microservicio que corresponde.
 */
@Injectable()
export class ProxyRequestUseCase {
  constructor(
    @Inject(SESSION_VERIFIER)
    private readonly sessionVerifier: SessionVerifierPort,

    @Inject(ADMIN_DIRECTORY)
    private readonly adminDirectory: AdminDirectoryPort,

    @Inject(UPSTREAM)
    private readonly upstream: UpstreamPort,
  ) {}

  async execute(request: GatewayRequest): Promise<UpstreamResponse> {
    const route = resolveRoute(request.method, request.path);

    if (!route) {
      throw new RouteNotFoundError();
    }

    let identity: Identity | null = null;

    if (route.access !== 'publica') {
      identity = await this.sessionVerifier.verify(request.cookie);

      const decision = evaluateAccess(
        route.access,
        identity,
        route.params,
        identity ? this.adminDirectory.isAdmin(identity.correo) : false,
      );

      if (decision === 'no-autenticado') {
        throw new UnauthenticatedError();
      }

      if (decision === 'prohibido') {
        throw new ForbiddenError();
      }
    }

    return this.upstream.forward({
      service: route.service,
      method: request.method.toUpperCase() as HttpMethod,
      path: `${route.upstreamPath}${request.query}`,
      body: request.body,
      contentType: request.contentType,
      cookie: route.service === 'usuarios' ? request.cookie : undefined,
      identity,
    });
  }
}
