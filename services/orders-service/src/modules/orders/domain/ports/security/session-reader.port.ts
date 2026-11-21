export type RequestHeaders = Record<string, string | string[] | undefined>;

/**
 * Obtiene el usuario autenticado de una solicitud entrante.
 * La sesión la valida el API Gateway; el adaptador solo lee la identidad.
 */
export interface SessionReader {
  readUserId(headers: RequestHeaders): string | null;
}

export const SESSION_READER = Symbol('SESSION_READER');
