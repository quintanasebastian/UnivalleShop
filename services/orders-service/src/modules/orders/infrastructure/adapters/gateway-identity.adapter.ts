import { Injectable } from '@nestjs/common';

import type {
  RequestHeaders,
  SessionReader,
} from '../../domain/ports/security/session-reader.port.js';

/** Cabecera que el API Gateway agrega después de validar la sesión. */
const USER_ID_HEADER = 'x-usuario-id';

/**
 * Lee el usuario que el API Gateway ya autenticó. Es seguro porque el
 * InternalTokenGuard solo deja entrar solicitudes que vienen del gateway.
 */
@Injectable()
export class GatewayIdentityAdapter implements SessionReader {
  readUserId(headers: RequestHeaders): string | null {
    const value = headers[USER_ID_HEADER];
    const usuarioId = Array.isArray(value) ? value[0] : value;

    return usuarioId?.trim() ? usuarioId.trim() : null;
  }
}
