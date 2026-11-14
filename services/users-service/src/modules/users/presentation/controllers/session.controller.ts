import { createHmac, timingSafeEqual } from 'node:crypto';
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

import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case.js';
import { FindUserByIdUseCase } from '../../application/use-cases/find-user-by-id.use-case.js';
import { LoginUserDto } from '../dto/login-user.dto.js';
import { User } from '../../domain/entities/user-entity.js';

const COOKIE_NAME = 'univalleshop_sesion';
const SECRET = process.env.SESSION_SECRET ?? 'univalleshop-dev-session-secret';

@Controller('sesion')
export class SessionController {
  private readonly revokedTokens = new Set<string>();

  constructor(
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
  ) {}

  private signToken(userId: string): string {
    const payload = Buffer.from(
      JSON.stringify({ sub: userId, iat: Date.now() }),
    ).toString('base64url');
    const signature = createHmac('sha256', SECRET)
      .update(payload)
      .digest('base64url');
    return `${payload}.${signature}`;
  }

  private verifyToken(token: string): string | null {
    if (this.revokedTokens.has(token)) return null;
    const [payload, signature] = token.split('.');
    if (!payload || !signature) return null;

    const expected = createHmac('sha256', SECRET)
      .update(payload)
      .digest('base64url');

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
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

  private readSessionCookie(req: Request): string | null {
    const header = req.headers.cookie;
    if (!header) return null;
    for (const part of header.split(';')) {
      const [rawName, ...rest] = part.trim().split('=');
      if (rawName === COOKIE_NAME) {
        return decodeURIComponent(rest.join('='));
      }
    }
    return null;
  }

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
    try {
      const user = await this.loginUserUseCase.execute(dto);
      const token = this.signToken(user.id);
      res.setHeader(
        'Set-Cookie',
        `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax`,
      );
      return this.toPublicUser(user);
    } catch {
      throw new UnauthorizedException('Correo o contraseña incorrectos.');
    }
  }

  @Get()
  async session(@Req() req: Request) {
    const token = this.readSessionCookie(req);
    if (!token) {
      throw new UnauthorizedException('No hay una sesión activa.');
    }

    const userId = this.verifyToken(token);
    if (!userId) {
      throw new UnauthorizedException('No hay una sesión activa.');
    }

    try {
      const user = await this.findUserByIdUseCase.execute(userId);
      if (!user.estado) {
        throw new UnauthorizedException('No hay una sesión activa.');
      }
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
    const token = this.readSessionCookie(req);
    if (token) {
      this.revokedTokens.add(token);
    }
    res.setHeader(
      'Set-Cookie',
      `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`,
    );
  }
}
