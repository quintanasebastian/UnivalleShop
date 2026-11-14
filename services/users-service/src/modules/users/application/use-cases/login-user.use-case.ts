import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user-entity.js';
import { USER_REPOSITORY } from '../../domain/ports/repositories/user.repository.js';
import type { UserRepository } from '../../domain/ports/repositories/user.repository.js';
import { PASSWORD_HASHER } from '../../domain/ports/security/password-hasher.port.js';
import type { PasswordHasherPort } from '../../domain/ports/security/password-hasher.port.js';

export interface LoginUserInput {
  correo: string;
  password: string;
}

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,

    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(input: LoginUserInput): Promise<User> {
    const correo = input.correo.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(correo);

    if (!user || !user.estado) {
      throw new Error('Correo o contraseña incorrectos.');
    }

    const validPassword = await this.passwordHasher.compare(
      input.password,
      user.passwordHash,
    );

    if (!validPassword) {
      throw new Error('Correo o contraseña incorrectos.');
    }

    return user;
  }
}
