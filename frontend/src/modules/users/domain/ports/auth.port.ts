import type { User } from '../model/user.entity';

export interface Credentials {
  correo: string;
  password: string;
}

export type Registration = User & Credentials;

export interface AuthPort {
  login(credentials: Credentials): Promise<void>;
  register(registration: Registration): Promise<void>;
  session(signal?: AbortSignal): Promise<User | null>;
  logout(): Promise<void>;
}
