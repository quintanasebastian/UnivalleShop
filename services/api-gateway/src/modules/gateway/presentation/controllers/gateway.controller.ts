import { All, Controller, Get, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';

import { ProxyRequestUseCase } from '../../application/use-cases/proxy-request.use-case.js';
import {
  ForbiddenError,
  RouteNotFoundError,
  ServiceUnavailableError,
  UnauthenticatedError,
} from '../../domain/errors/gateway.errors.js';

const METHODS_WITH_BODY = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/** Adaptador de entrada HTTP: traduce Express ↔ caso de uso. */
@Controller()
export class GatewayController {
  constructor(private readonly proxyRequest: ProxyRequestUseCase) {}

  @Get('health')
  health() {
    return { estado: 'ok' };
  }

  @All('{*ruta}')
  async proxy(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      const queryIndex = req.originalUrl.indexOf('?');
      const hasBody =
        METHODS_WITH_BODY.has(req.method) &&
        req.body !== undefined &&
        typeof req.body === 'object' &&
        Object.keys(req.body as object).length > 0;

      const upstream = await this.proxyRequest.execute({
        method: req.method,
        path: req.path,
        query: queryIndex >= 0 ? req.originalUrl.slice(queryIndex) : '',
        cookie: req.headers.cookie,
        body: hasBody ? JSON.stringify(req.body) : undefined,
        contentType: hasBody ? 'application/json' : undefined,
      });

      res.status(upstream.status);
      if (upstream.contentType) {
        res.setHeader('content-type', upstream.contentType);
      }
      if (upstream.setCookies.length > 0) {
        res.setHeader('set-cookie', upstream.setCookies);
      }
      res.end(upstream.body);
    } catch (error) {
      const [status, message] = this.toHttpError(error);
      res.status(status).json({ statusCode: status, message });
    }
  }

  private toHttpError(error: unknown): [number, string] {
    if (error instanceof RouteNotFoundError) return [404, error.message];
    if (error instanceof UnauthenticatedError) return [401, error.message];
    if (error instanceof ForbiddenError) return [403, error.message];
    if (error instanceof ServiceUnavailableError) return [503, error.message];
    return [502, 'No fue posible procesar la solicitud.'];
  }
}
