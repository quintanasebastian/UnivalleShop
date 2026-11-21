import { timingSafeEqual } from 'node:crypto';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

/**
 * Solo acepta solicitudes que traen el token interno que pone el API Gateway
 * (o, en llamadas entre servicios, el propio microservicio que llama).
 * Si INTERNAL_TOKEN no está definido (ejecución local sin Docker), no bloquea.
 */
@Injectable()
export class InternalTokenGuard implements CanActivate {
  private readonly expected = process.env.INTERNAL_TOKEN;

  canActivate(context: ExecutionContext): boolean {
    if (!this.expected) {
      return true;
    }

    const received = context.switchToHttp().getRequest<Request>().headers['x-internal-token'];

    if (typeof received === 'string' && this.matches(received, this.expected)) {
      return true;
    }

    throw new UnauthorizedException('Las solicitudes deben pasar por el API Gateway.');
  }

  private matches(received: string, expected: string): boolean {
    const a = Buffer.from(received);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  }
}
