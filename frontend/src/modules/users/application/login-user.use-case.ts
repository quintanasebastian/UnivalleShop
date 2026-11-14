import { institutionalEmail } from '../domain/model/email.vo';
import type { AuthPort, Credentials } from '../domain/ports/auth.port';

export function loginUser(port: AuthPort, credentials: Credentials) {
  const correo = institutionalEmail(credentials.correo);
  if (new TextEncoder().encode(credentials.password).length > 72) {
    throw new Error('La contraseña supera el límite de 72 bytes.');
  }
  return port.login({ correo, password: credentials.password });
}
