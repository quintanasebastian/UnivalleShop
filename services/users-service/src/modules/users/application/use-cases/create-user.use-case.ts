import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../domain/entities/user-entity.js';
import { USER_REPOSITORY_PORT } from '../../domain/ports/repositories/user.repository.js';
import type { UserRepositoryPort } from '../../domain/ports/repositories/user.repository.js';

export interface CreateUserDto {
  name: string;
  email: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    console.log('[USE CASE] Ejecutando CreateUser con:', dto);

    const user = new User('', dto.name, dto.email);

    return this.userRepository.saveUser(user);
  }
}