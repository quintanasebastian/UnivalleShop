import type { HttpMethod, Identity, ServiceName } from '../model/route.js';

export interface UpstreamRequest {
  service: ServiceName;
  method: HttpMethod;
  /** Ruta y query string que recibe el microservicio. */
  path: string;
  body?: string;
  contentType?: string;
  /** Solo se reenvía al servicio de usuarios (maneja la cookie de sesión). */
  cookie?: string;
  identity: Identity | null;
}

export interface UpstreamResponse {
  status: number;
  contentType?: string;
  setCookies: string[];
  body: Buffer;
}

/** Reenvía una solicitud ya autorizada al microservicio correspondiente. */
export interface UpstreamPort {
  forward(request: UpstreamRequest): Promise<UpstreamResponse>;
}

export const UPSTREAM = Symbol('UPSTREAM');
