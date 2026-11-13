import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case.js';
import { FindUserByIdUseCase } from '../../application/use-cases/find-user-by-id.use-case.js';
import { FindAllUsersUseCase } from '../../application/use-cases/find-all-users.use-case.js';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case.js';
import { DeactivateUserUseCase } from '../../application/use-cases/deactivate-user.use-case.js';

import { CreateUserDto } from '../dto/create-user.dto.js';
import { UpdateUserDto } from '../dto/update-user.dto.js';
import { User } from '../../domain/entities/user-entity.js';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deactivateUserUseCase: DeactivateUserUseCase,
  ) {}

  private toPublicUser(user: User | null) {
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    const {
      passwordHash: _passwordHash,
      ...publicUser
    } = user;

    return publicUser;
  }

  private handleError(error: unknown): never {
    if (!(error instanceof Error)) {
      throw error;
    }

    if (error.message.includes('no encontrado')) {
      throw new NotFoundException(error.message);
    }

    if (error.message.includes('Ya existe')) {
      throw new ConflictException(error.message);
    }

    if (
      error.message.includes('correo') ||
      error.message.includes('nombres') ||
      error.message.includes('apellidos')
    ) {
      throw new BadRequestException(error.message);
    }

    throw error;
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    try {
      const user = await this.createUserUseCase.execute(dto);

      return this.toPublicUser(user);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Get()
  async findAll() {
    const users = await this.findAllUsersUseCase.execute();

    return users.map((user) => this.toPublicUser(user));
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      const user = await this.findUserByIdUseCase.execute(id);

      return this.toPublicUser(user);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    try {
      const user = await this.updateUserUseCase.execute(id, dto);

      return this.toPublicUser(user);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id') id: string) {
    try {
      const user = await this.deactivateUserUseCase.execute(id);

      return this.toPublicUser(user);
    } catch (error) {
      this.handleError(error);
    }
  }
}
