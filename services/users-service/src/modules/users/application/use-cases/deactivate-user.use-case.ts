import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/ports/repositories/user.repository.js';
import type { UserRepository } from '../../domain/ports/repositories/user.repository.js';


@Injectable()
export class DeactivateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error('Usuario no encontrado.');
    }

    user.deactivate();

    return this.userRepository.save(user);
  }
}
