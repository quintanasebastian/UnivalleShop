import type { Identity } from '../model/route.js';

/** Valida la sesión del usuario (la implementa el servicio de usuarios). */
export interface SessionVerifierPort {
  verify(cookieHeader: string | undefined): Promise<Identity | null>;
}

export const SESSION_VERIFIER = Symbol('SESSION_VERIFIER');
