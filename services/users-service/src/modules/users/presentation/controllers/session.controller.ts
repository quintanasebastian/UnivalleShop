import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import { EndSessionUseCase } from '../../application/use-cases/end-session.use-case.js';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case.js';
import { StartSessionUseCase } from '../../application/use-cases/start-session.use-case.js';
import { ValidateSessionUseCase } from '../../application/use-cases/validate-session.use-case.js';
import { User } from '../../domain/entities/user-entity.js';
import { LoginUserDto } from '../dto/login-user.dto.js';
import {
  buildSessionCookie,
  clearSessionCookie,
  readSessionCookie,
} from '../http/session-cookie.js';

/**
 * Adaptador de entrada HTTP: solo traduce cookies y códigos HTTP.
 * Toda la lógica de sesiones está en los casos de uso.
 */
@Controller('sesion')
export class SessionController {
  constructor(
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly startSessionUseCase: StartSessionUseCase,
    private readonly validateSessionUseCase: ValidateSessionUseCase,
    private readonly endSessionUseCase: EndSessionUseCase,
  ) {}

  private toPublicUser(user: User) {
    const { passwordHash: _passwordHash, ...publicUser } = user;
    return publicUser;
  }

  @Post()
  @HttpCode(200)
  async login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    let user: User;

    try {
      user = await this.loginUserUseCase.execute(dto);
    } catch {
      throw new UnauthorizedException('Correo o contraseña incorrectos.');
    }

    const session = await this.startSessionUseCase.execute(user.id);
    res.setHeader('Set-Cookie', buildSessionCookie(session.token, session.secondsRemaining()));

    return this.toPublicUser(user);
  }

  @Get()
  async session(@Req() req: Request) {
    try {
      const user = await this.validateSessionUseCase.execute(
        readSessionCookie(req.headers.cookie),
      );
      return this.toPublicUser(user);
    } catch {
      throw new UnauthorizedException('No hay una sesión activa.');
    }
  }

  @Delete()
  @HttpCode(204)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.endSessionUseCase.execute(readSessionCookie(req.headers.cookie));
    res.setHeader('Set-Cookie', clearSessionCookie());
  }
}
