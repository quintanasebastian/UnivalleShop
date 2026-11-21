import { Module } from '@nestjs/common';

import { ProxyRequestUseCase } from './application/use-cases/proxy-request.use-case.js';
import { ADMIN_DIRECTORY } from './domain/ports/admin-directory.port.js';
import { SESSION_VERIFIER } from './domain/ports/session-verifier.port.js';
import { UPSTREAM } from './domain/ports/upstream.port.js';
import { EnvAdminDirectoryAdapter } from './infrastructure/adapters/env-admin-directory.adapter.js';
import { HttpUpstreamAdapter } from './infrastructure/adapters/http-upstream.adapter.js';
import { UsersSessionHttpAdapter } from './infrastructure/adapters/users-session-http.adapter.js';
import { GATEWAY_CONFIG, loadGatewayConfig } from './infrastructure/config/gateway.config.js';
import { GatewayController } from './presentation/controllers/gateway.controller.js';

@Module({
  controllers: [GatewayController],

  providers: [
    {
      provide: GATEWAY_CONFIG,
      useFactory: loadGatewayConfig,
    },
    {
      provide: SESSION_VERIFIER,
      useClass: UsersSessionHttpAdapter,
    },
    {
      provide: UPSTREAM,
      useClass: HttpUpstreamAdapter,
    },
    {
      provide: ADMIN_DIRECTORY,
      useClass: EnvAdminDirectoryAdapter,
    },

    ProxyRequestUseCase,
  ],
})
export class GatewayModule {}
