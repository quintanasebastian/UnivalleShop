import type { AccessLevel, Identity } from '../model/route.js';

export type AccessDecision = 'permitido' | 'no-autenticado' | 'prohibido';

/**
 * Política de acceso centralizada (regla de negocio pura, sin HTTP).
 */
export function evaluateAccess(
  access: AccessLevel,
  identity: Identity | null,
  params: Record<string, string>,
  isAdmin: boolean,
): AccessDecision {
  if (access === 'publica') {
    return 'permitido';
  }

  if (!identity) {
    return 'no-autenticado';
  }

  switch (access) {
    case 'autenticada':
      return 'permitido';
    case 'propietario':
      return isAdmin || params.id === identity.usuarioId ? 'permitido' : 'prohibido';
    case 'admin':
      return isAdmin ? 'permitido' : 'prohibido';
  }
}
