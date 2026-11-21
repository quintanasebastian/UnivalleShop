import { randomBytes } from 'node:crypto';
import { Injectable } from '@nestjs/common';

import type { TokenGeneratorPort } from '../../domain/ports/security/token-generator.port.js';

@Injectable()
export class CryptoTokenGeneratorAdapter implements TokenGeneratorPort {
  generate(): string {
    return randomBytes(32).toString('base64url');
  }
}
