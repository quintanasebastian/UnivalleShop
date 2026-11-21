import { Inject, Injectable } from '@nestjs/common';

import type { AdminDirectoryPort } from '../../domain/ports/admin-directory.port.js';
import { GATEWAY_CONFIG } from '../config/gateway.config.js';
import type { GatewayConfig } from '../config/gateway.config.js';

/** Administradores definidos en la variable ADMIN_EMAILS (separados por comas). */
@Injectable()
export class EnvAdminDirectoryAdapter implements AdminDirectoryPort {
  private readonly admins: ReadonlySet<string>;

  constructor(
    @Inject(GATEWAY_CONFIG)
    config: GatewayConfig,
  ) {
    this.admins = new Set(config.adminEmails);
  }

  isAdmin(correo: string): boolean {
    return this.admins.has(correo.trim().toLowerCase());
  }
}
