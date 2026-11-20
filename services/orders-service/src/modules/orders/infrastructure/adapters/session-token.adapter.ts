import { createHmac, timingSafeEqual } from 'node:crypto';
import { Injectable } from '@nestjs/common';

import type { SessionReader } from '../../domain/ports/security/session-reader.port.js';

const COOKIE_NAME = 'univalleshop_sesion';
const SECRET = process.env.SESSION_SECRET ?? 'univalleshop-dev-session-secret';

@Injectable()
export class SessionTokenAdapter implements SessionReader {
  readUserId(cookieHeader: string | undefined): string | null {
    const token = this.readSessionCookie(cookieHeader);

    if (!token) {
      return null;
    }

    const [payload, signature] = token.split('.');

    if (!payload || !signature) {
      return null;
    }

    const expected = createHmac('sha256', SECRET)
      .update(payload)
      .digest('base64url');

    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);

    if (
      signatureBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
      return null;
    }

    try {
      const parsed = JSON.parse(
        Buffer.from(payload, 'base64url').toString('utf8'),
      ) as { sub?: string };

      return typeof parsed.sub === 'string' ? parsed.sub : null;
    } catch {
      return null;
    }
  }

  private readSessionCookie(cookieHeader: string | undefined): string | null {
    if (!cookieHeader) {
      return null;
    }

    for (const part of cookieHeader.split(';')) {
      const [rawName, ...rest] = part.trim().split('=');

      if (rawName === COOKIE_NAME) {
        return decodeURIComponent(rest.join('='));
      }
    }

    return null;
  }
}
