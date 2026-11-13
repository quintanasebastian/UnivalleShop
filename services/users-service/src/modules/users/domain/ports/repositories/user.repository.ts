import { User, UpdateUserData } from '../../entities/user-entity.js';

export interface UserRepository {
  save(user: User): Promise<User>;

  findById(id: string): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;

  findAll(): Promise<User[]>;

  update(id: string, data: UpdateUserData): Promise<User | null>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
