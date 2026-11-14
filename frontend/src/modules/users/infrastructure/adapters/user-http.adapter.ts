import { HttpError, request } from '../../../../shared/infrastructure/http-client';
import type { AuthPort } from '../../domain/ports/auth.port';
import type { User } from '../../domain/model/user.entity';

const base = '/api/usuarios';
const sessionPath = `${base}/sesion`;

function post(body: object): RequestInit {
  return { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}

export const userHttpAdapter: AuthPort = {
  async login(credentials) {
    try {
      await request<void>(sessionPath, post(credentials));
    } catch (error) {
      if (error instanceof HttpError && error.status === 401) {
        throw new Error('Correo o contraseña incorrectos.');
      }
      throw error;
    }
  },
  async register(registration) {
    await request<User>(`${base}/users`, post(registration));
  },
  async session(signal) {
    try {
      return await request<User>(sessionPath, { signal });
    } catch (error) {
      if (error instanceof HttpError && error.status === 401) return null;
      throw error;
    }
  },
  async logout() {
    await request<void>(sessionPath, { method: 'DELETE' });
  },
};
