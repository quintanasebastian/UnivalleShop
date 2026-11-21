/** Indica qué usuarios administran la tienda. */
export interface AdminDirectoryPort {
  isAdmin(correo: string): boolean;
}

export const ADMIN_DIRECTORY = Symbol('ADMIN_DIRECTORY');
