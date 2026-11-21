import type { ServiceName } from '../../domain/model/route.js';

export interface GatewayConfig {
  services: Record<ServiceName, string>;
  internalToken?: string;
  adminEmails: string[];
  timeoutMs: number;
}

export const GATEWAY_CONFIG = Symbol('GATEWAY_CONFIG');

function url(value: string | undefined, fallback: string): string {
  return (value ?? fallback).replace(/\/+$/, '');
}

/** Lee la configuración de las variables de entorno (docker-compose). */
export function loadGatewayConfig(): GatewayConfig {
  return {
    services: {
      usuarios: url(process.env.USERS_SERVICE_URL, 'http://localhost:3001'),
      catalogo: url(process.env.CATALOG_SERVICE_URL, 'http://localhost:3002'),
      pedidos: url(process.env.ORDERS_SERVICE_URL, 'http://localhost:3003'),
    },
    internalToken: process.env.INTERNAL_TOKEN || undefined,
    adminEmails: (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map((correo) => correo.trim().toLowerCase())
      .filter(Boolean),
    timeoutMs: Number(process.env.UPSTREAM_TIMEOUT_MS ?? 10000),
  };
}
