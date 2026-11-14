import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  UserSchema,
  UserMongoSchema,
} from './infrastructure/schemas/user.schema.js';

import {
  USER_REPOSITORY,
} from './domain/ports/repositories/user.repository.js';

import {
  PASSWORD_HASHER,
} from './domain/ports/security/password-hasher.port.js';

import {
  UserMongoRepositoryAdapter,
} from './infrastructure/adapters/user-mongo.repository.adapters.js';

import {
  BcryptPasswordHasherAdapter,
} from './infrastructure/adapters/bcrypt-password-hasher.adapter.js';

import { CreateUserUseCase } from './application/use-cases/create-user.use-case.js';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case.js';
import { FindUserByIdUseCase } from './application/use-cases/find-user-by-id.use-case.js';
import { FindAllUsersUseCase } from './application/use-cases/find-all-users.use-case.js';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case.js';
import { DeactivateUserUseCase } from './application/use-cases/deactivate-user.use-case.js';

import { UsersController } from './presentation/controllers/users.controller.js';
import { SessionController } from './presentation/controllers/session.controller.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserSchema.name,
        schema: UserMongoSchema,
      },
    ]),
  ],

  controllers: [UsersController, SessionController],

  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserMongoRepositoryAdapter,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasherAdapter,
    },

    CreateUserUseCase,
    LoginUserUseCase,
    FindUserByIdUseCase,
    FindAllUsersUseCase,
    UpdateUserUseCase,
    DeactivateUserUseCase,
  ],

  exports: [
    USER_REPOSITORY,
  ],
})
export class UsersModule {}
