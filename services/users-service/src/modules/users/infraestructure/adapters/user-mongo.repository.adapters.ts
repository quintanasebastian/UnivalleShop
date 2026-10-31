import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../../domain/ports/repositories/user.repository.js';
import { User } from '../../domain/entities/user-entity.js';

@Injectable()
export class UserMongoRepositoryAdapter implements UserRepositoryPort {
  private users: User[] = [];

  async saveUser(user: User): Promise<User> {
    console.log('[FAKE MONGO] Guardando usuario:', user);
    
    const userToSave = new User(
      Date.now().toString(),
      user.name,
      user.email,
    );

    this.users.push(userToSave);
    return userToSave;
  }
}