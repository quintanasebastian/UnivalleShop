import { User } from '../../entities/user-entity.js';

export interface UserRepositoryPort {
  saveUser(user: User): Promise<User>;
}

export const USER_REPOSITORY_PORT = 'USER_REPOSITORY_PORT';