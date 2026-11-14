import { institutionalEmail } from '../domain/model/email.vo';
import type { AuthPort, Registration } from '../domain/ports/auth.port';

export function registerUser(port: AuthPort, registration: Registration) {
  const correo = institutionalEmail(registration.correo);
  const nombres = registration.nombres.trim();
  const apellidos = registration.apellidos.trim();
  const { password } = registration;
  if (nombres.length < 2 || apellidos.length < 2) {
    throw new Error('Ingresa nombres y apellidos de al menos dos caracteres.');
  }
  if (password.length < 8 || new TextEncoder().encode(password).length > 72) {
    throw new Error('La contraseña debe tener al menos 8 caracteres y máximo 72 bytes.');
  }
  return port.register({ ...registration, correo, nombres, apellidos });
}
