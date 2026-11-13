import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/ports/repositories/user.repository.js';
import type { UserRepository } from '../../domain/ports/repositories/user.repository.js';

import { UpdateUserData } from '../../domain/entities/user-entity.js';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string, data: UpdateUserData) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error('Usuario no encontrado.');
    }

    return this.userRepository.update(id, data);
  }
}
