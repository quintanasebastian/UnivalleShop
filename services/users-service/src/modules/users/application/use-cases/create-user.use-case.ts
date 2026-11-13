import { Inject, Injectable } from '@nestjs/common';
import {
  User,
  UserType,
} from '../../domain/entities/user-entity.js';

import { USER_REPOSITORY } from '../../domain/ports/repositories/user.repository.js';
import type { UserRepository } from '../../domain/ports/repositories/user.repository.js';

import { PASSWORD_HASHER } from '../../domain/ports/security/password-hasher.port.js';
import type { PasswordHasherPort } from '../../domain/ports/security/password-hasher.port.js';

export interface CreateUserInput {
  nombres: string;
  apellidos: string;
  correo: string;
  password: string;
  tipoUsuario: UserType;
  telefono?: string;
  direccion?: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,

    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(input: CreateUserInput): Promise<User> {
    const correo = input.correo.trim().toLowerCase();

    if (!/^[^\s@]+@correounivalle\.edu\.co$/.test(correo)) {
      throw new Error('Debes utilizar un correo institucional de Univalle.');
    }

    const existingUser = await this.userRepository.findByEmail(correo);

    if (existingUser) {
      throw new Error('Ya existe un usuario registrado con este correo.');
    }

    const passwordHash = await this.passwordHasher.hash(input.password);

    const now = new Date();

    const user = User.create({
      id: '',
      nombres: input.nombres,
      apellidos: input.apellidos,
      correo,
      passwordHash,
      tipoUsuario: input.tipoUsuario,
      telefono: input.telefono,
      direccion: input.direccion,
      estado: true,
      createdAt: now,
      updatedAt: now,
    });

    return this.userRepository.save(user);
  }
}
