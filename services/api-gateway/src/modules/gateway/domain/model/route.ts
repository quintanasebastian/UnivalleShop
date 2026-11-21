/** Microservicios a los que el gateway puede enrutar. */
export type ServiceName = 'usuarios' | 'catalogo' | 'pedidos';

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

/**
 * Nivel de acceso de una ruta:
 * - publica: cualquiera (login, registro, consultar la sesión).
 * - autenticada: cualquier integrante de Univalle con sesión activa.
 * - propietario: solo el dueño del recurso (`:id` = su usuario) o un administrador.
 * - admin: solo administradores de la tienda.
 */
export type AccessLevel = 'publica' | 'autenticada' | 'propietario' | 'admin';

export interface RouteRule {
  service: ServiceName;
  method: HttpMethod;
  /** Ruta pública con parámetros, p. ej. `/api/products/:id`. */
  pattern: string;
  access: AccessLevel;
}

export interface ResolvedRoute {
  service: ServiceName;
  access: AccessLevel;
  /** Ruta que se envía al microservicio (sin el prefijo del gateway). */
  upstreamPath: string;
  params: Record<string, string>;
}

export interface Identity {
  usuarioId: string;
  correo: string;
}
