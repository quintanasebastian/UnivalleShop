/**
 * Detalles HTTP de la cookie de sesión (capa de presentación).
 * El dominio solo conoce el token; aquí se decide cómo viaja por HTTP.
 */
const COOKIE_NAME = 'univalleshop_sesion';

export function readSessionCookie(cookieHeader: string | undefined): string | null {
  if (!cookieHeader) {
    return null;
  }

  for (const part of cookieHeader.split(';')) {
    const [rawName, ...rest] = part.trim().split('=');

    if (rawName === COOKIE_NAME) {
      return decodeURIComponent(rest.join('=')) || null;
    }
  }

  return null;
}

export function buildSessionCookie(token: string, maxAgeSeconds: number): string {
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAgeSeconds}; HttpOnly; SameSite=Lax`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`;
}
