import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

import { AddItemToCartUseCase } from '../../application/use-cases/add-item-to-cart.use-case.js';
import { GetCartUseCase } from '../../application/use-cases/get-cart.use-case.js';
import { RemoveCartItemUseCase } from '../../application/use-cases/remove-cart-item.use-case.js';
import { UpdateCartItemUseCase } from '../../application/use-cases/update-cart-item.use-case.js';
import { SESSION_READER } from '../../domain/ports/security/session-reader.port.js';
import type { SessionReader } from '../../domain/ports/security/session-reader.port.js';
import { AddCartItemDto } from '../dto/add-cart-item.dto.js';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto.js';
import { mapDomainErrorToHttp } from '../http-error.mapper.js';

@Controller('carrito')
export class CartController {
  constructor(
    @Inject(SESSION_READER)
    private readonly sessionReader: SessionReader,
    private readonly getCartUseCase: GetCartUseCase,
    private readonly addItemToCartUseCase: AddItemToCartUseCase,
    private readonly updateCartItemUseCase: UpdateCartItemUseCase,
    private readonly removeCartItemUseCase: RemoveCartItemUseCase,
  ) {}

  private requireUser(request: Request): string {
    const usuarioId = this.sessionReader.readUserId(request.headers.cookie);

    if (!usuarioId) {
      throw new UnauthorizedException('Debes iniciar sesión para usar el carrito.');
    }

    return usuarioId;
  }

  @Get()
  find(@Req() request: Request) {
    return this.getCartUseCase.execute(this.requireUser(request));
  }

  @Post('items')
  async addItem(@Req() request: Request, @Body() dto: AddCartItemDto) {
    try {
      return await this.addItemToCartUseCase.execute({
        usuarioId: this.requireUser(request),
        productoId: dto.productoId,
        nombre: dto.nombre,
        precioUnitario: dto.precioUnitario,
        cantidad: dto.cantidad,
      });
    } catch (error) {
      mapDomainErrorToHttp(error);
    }
  }

  @Patch('items/:productoId')
  async updateItem(
    @Req() request: Request,
    @Param('productoId') productoId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    try {
      return await this.updateCartItemUseCase.execute({
        usuarioId: this.requireUser(request),
        productoId,
        cantidad: dto.cantidad,
      });
    } catch (error) {
      mapDomainErrorToHttp(error);
    }
  }

  @Delete('items/:productoId')
  async removeItem(
    @Req() request: Request,
    @Param('productoId') productoId: string,
  ) {
    try {
      return await this.removeCartItemUseCase.execute({
        usuarioId: this.requireUser(request),
        productoId,
      });
    } catch (error) {
      mapDomainErrorToHttp(error);
    }
  }
}
