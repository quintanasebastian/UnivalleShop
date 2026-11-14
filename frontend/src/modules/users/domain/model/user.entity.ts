export type UserRole = 'estudiante' | 'docente' | 'administrativo';

export interface User {
  nombres: string;
  apellidos: string;
  correo: string;
  tipoUsuario: UserRole;
}
