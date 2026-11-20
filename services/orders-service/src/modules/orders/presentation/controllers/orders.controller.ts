import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

import { ChangeOrderStatusUseCase } from '../../application/use-cases/change-order-status.use-case.js';
import { CheckoutUseCase } from '../../application/use-cases/checkout.use-case.js';
import { FindOrderByIdUseCase } from '../../application/use-cases/find-order-by-id.use-case.js';
import { FindOrdersByUserUseCase } from '../../application/use-cases/find-orders-by-user.use-case.js';
import { SESSION_READER } from '../../domain/ports/security/session-reader.port.js';
import type { SessionReader } from '../../domain/ports/security/session-reader.port.js';
import { ChangeOrderStatusDto } from '../dto/change-order-status.dto.js';
import { mapDomainErrorToHttp } from '../http-error.mapper.js';

@Controller('pedidos')
export class OrdersController {
  constructor(
    @Inject(SESSION_READER)
    private readonly sessionReader: SessionReader,
    private readonly checkoutUseCase: CheckoutUseCase,
    private readonly findOrdersByUserUseCase: FindOrdersByUserUseCase,
    private readonly findOrderByIdUseCase: FindOrderByIdUseCase,
    private readonly changeOrderStatusUseCase: ChangeOrderStatusUseCase,
  ) {}

  private requireUser(request: Request): string {
    const usuarioId = this.sessionReader.readUserId(request.headers.cookie);

    if (!usuarioId) {
      throw new UnauthorizedException('Debes iniciar sesión para ver tus pedidos.');
    }

    return usuarioId;
  }

  @Get()
  findAll(@Req() request: Request) {
    return this.findOrdersByUserUseCase.execute(this.requireUser(request));
  }

  @Post('checkout')
  async checkout(@Req() request: Request) {
    try {
      return await this.checkoutUseCase.execute(this.requireUser(request));
    } catch (error) {
      mapDomainErrorToHttp(error);
    }
  }

  @Get(':id')
  async findById(@Req() request: Request, @Param('id') id: string) {
    try {
      return await this.findOrderByIdUseCase.execute({
        usuarioId: this.requireUser(request),
        id,
      });
    } catch (error) {
      mapDomainErrorToHttp(error);
    }
  }

  @Patch(':id/estado')
  async changeStatus(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() dto: ChangeOrderStatusDto,
  ) {
    try {
      return await this.changeOrderStatusUseCase.execute({
        usuarioId: this.requireUser(request),
        id,
        estado: dto.estado,
      });
    } catch (error) {
      mapDomainErrorToHttp(error);
    }
  }
}
