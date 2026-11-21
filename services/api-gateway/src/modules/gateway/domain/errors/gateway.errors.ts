import type { ServiceName } from '../model/route.js';

export class RouteNotFoundError extends Error {
  constructor() {
    super('Ruta no encontrada.');
  }
}

export class UnauthenticatedError extends Error {
  constructor() {
    super('Debes iniciar sesión para continuar.');
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super('No tienes permisos para realizar esta acción.');
  }
}

export class ServiceUnavailableError extends Error {
  constructor(public readonly service: ServiceName) {
    super(`El servicio de ${service} no está disponible en este momento.`);
  }
}
