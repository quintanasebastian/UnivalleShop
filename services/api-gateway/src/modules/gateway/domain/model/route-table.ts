import type { ResolvedRoute, RouteRule, ServiceName } from './route.js';

/** Prefijo público de cada servicio; se quita antes de reenviar. */
const SERVICE_PREFIX: Record<ServiceName, string> = {
  usuarios: '/api/usuarios',
  catalogo: '/api',
  pedidos: '/api/pedidos',
};

/**
 * Tabla de rutas expuestas. Lo que no aparece aquí NO es accesible desde
 * fuera: por ejemplo, `PATCH /products/:id/stock` solo lo usa el servicio de
 * pedidos dentro de la red interna de Docker.
 */
export const ROUTE_TABLE: readonly RouteRule[] = [
  // Usuarios y sesión
  { service: 'usuarios', method: 'POST', pattern: '/api/usuarios/sesion', access: 'publica' },
  { service: 'usuarios', method: 'GET', pattern: '/api/usuarios/sesion', access: 'publica' },
  { service: 'usuarios', method: 'DELETE', pattern: '/api/usuarios/sesion', access: 'publica' },
  { service: 'usuarios', method: 'POST', pattern: '/api/usuarios/users', access: 'publica' },
  { service: 'usuarios', method: 'GET', pattern: '/api/usuarios/users', access: 'admin' },
  { service: 'usuarios', method: 'GET', pattern: '/api/usuarios/users/:id', access: 'propietario' },
  { service: 'usuarios', method: 'PATCH', pattern: '/api/usuarios/users/:id', access: 'propietario' },
  { service: 'usuarios', method: 'PATCH', pattern: '/api/usuarios/users/:id/deactivate', access: 'propietario' },

  // Catálogo
  { service: 'catalogo', method: 'GET', pattern: '/api/products', access: 'autenticada' },
  { service: 'catalogo', method: 'GET', pattern: '/api/products/:id', access: 'autenticada' },
  { service: 'catalogo', method: 'POST', pattern: '/api/products', access: 'admin' },
  { service: 'catalogo', method: 'PATCH', pattern: '/api/products/:id', access: 'admin' },
  { service: 'catalogo', method: 'DELETE', pattern: '/api/products/:id', access: 'admin' },

  // Carrito y pedidos
  { service: 'pedidos', method: 'GET', pattern: '/api/pedidos/carrito', access: 'autenticada' },
  { service: 'pedidos', method: 'POST', pattern: '/api/pedidos/carrito/items', access: 'autenticada' },
  { service: 'pedidos', method: 'PATCH', pattern: '/api/pedidos/carrito/items/:productoId', access: 'autenticada' },
  { service: 'pedidos', method: 'DELETE', pattern: '/api/pedidos/carrito/items/:productoId', access: 'autenticada' },
  { service: 'pedidos', method: 'GET', pattern: '/api/pedidos/pedidos', access: 'autenticada' },
  { service: 'pedidos', method: 'POST', pattern: '/api/pedidos/pedidos/checkout', access: 'autenticada' },
  { service: 'pedidos', method: 'GET', pattern: '/api/pedidos/pedidos/:id', access: 'autenticada' },
  { service: 'pedidos', method: 'PATCH', pattern: '/api/pedidos/pedidos/:id/estado', access: 'autenticada' },
];

function segments(path: string): string[] {
  return path.split('/').filter(Boolean);
}

function match(pattern: string, path: string): Record<string, string> | null {
  const expected = segments(pattern);
  const actual = segments(path);

  if (expected.length !== actual.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < expected.length; i += 1) {
    if (expected[i].startsWith(':')) {
      params[expected[i].slice(1)] = decodeURIComponent(actual[i]);
    } else if (expected[i] !== actual[i]) {
      return null;
    }
  }

  return params;
}

/** Busca la regla que corresponde a la solicitud; `null` si no está expuesta. */
export function resolveRoute(
  method: string,
  path: string,
  table: readonly RouteRule[] = ROUTE_TABLE,
): ResolvedRoute | null {
  const normalizedMethod = method.toUpperCase();

  for (const rule of table) {
    if (rule.method !== normalizedMethod) {
      continue;
    }

    const params = match(rule.pattern, path);

    if (params) {
      return {
        service: rule.service,
        access: rule.access,
        upstreamPath: path.slice(SERVICE_PREFIX[rule.service].length) || '/',
        params,
      };
    }
  }

  return null;
}
