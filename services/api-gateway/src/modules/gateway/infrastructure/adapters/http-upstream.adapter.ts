import { Inject, Injectable } from '@nestjs/common';

import { ServiceUnavailableError } from '../../domain/errors/gateway.errors.js';
import type {
  UpstreamPort,
  UpstreamRequest,
  UpstreamResponse,
} from '../../domain/ports/upstream.port.js';
import { GATEWAY_CONFIG } from '../config/gateway.config.js';
import type { GatewayConfig } from '../config/gateway.config.js';

/**
 * Reenvía la solicitud por HTTP. Las cabeceras de identidad las construye
 * el gateway: nunca se copian las que manda el navegador.
 */
@Injectable()
export class HttpUpstreamAdapter implements UpstreamPort {
  constructor(
    @Inject(GATEWAY_CONFIG)
    private readonly config: GatewayConfig,
  ) {}

  async forward(request: UpstreamRequest): Promise<UpstreamResponse> {
    const headers: Record<string, string> = { accept: 'application/json' };

    if (this.config.internalToken) {
      headers['x-internal-token'] = this.config.internalToken;
    }
    if (request.contentType) {
      headers['content-type'] = request.contentType;
    }
    if (request.cookie) {
      headers.cookie = request.cookie;
    }
    if (request.identity) {
      headers['x-usuario-id'] = request.identity.usuarioId;
      headers['x-usuario-correo'] = request.identity.correo;
    }

    let response: Response;

    try {
      response = await fetch(`${this.config.services[request.service]}${request.path}`, {
        method: request.method,
        headers,
        body: request.body,
        signal: AbortSignal.timeout(this.config.timeoutMs),
      });
    } catch {
      throw new ServiceUnavailableError(request.service);
    }

    return {
      status: response.status,
      contentType: response.headers.get('content-type') ?? undefined,
      setCookies: response.headers.getSetCookie(),
      body: Buffer.from(await response.arrayBuffer()),
    };
  }
}
