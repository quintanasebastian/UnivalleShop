export type UserType = 'estudiante' | 'docente' | 'administrativo';

export interface UserData {
  id: string;
  nombres: string;
  apellidos: string;
  correo: string;
  passwordHash: string;
  tipoUsuario: UserType;
  telefono?: string;
  direccion?: string;
  estado: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserData {
  nombres?: string;
  apellidos?: string;
  telefono?: string;
  direccion?: string;
}

export class User {
  private constructor(
    public readonly id: string,
    public nombres: string,
    public apellidos: string,
    public readonly correo: string,
    public readonly passwordHash: string,
    public readonly tipoUsuario: UserType,
    public telefono: string | undefined,
    public direccion: string | undefined,
    public estado: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(data: UserData): User {
    const normalizedEmail = data.correo.trim().toLowerCase();

    if (!/^[^\s@]+@correounivalle\.edu\.co$/.test(normalizedEmail)) {
      throw new Error('El correo debe ser institucional de Univalle.');
    }

    if (!data.nombres.trim() || !data.apellidos.trim()) {
      throw new Error('Los nombres y apellidos son obligatorios.');
    }

    return new User(
      data.id,
      data.nombres.trim(),
      data.apellidos.trim(),
      normalizedEmail,
      data.passwordHash,
      data.tipoUsuario,
      data.telefono,
      data.direccion,
      data.estado,
      data.createdAt,
      data.updatedAt,
    );
  }

  updateProfile(data: UpdateUserData): void {
    if (data.nombres !== undefined) {
      this.nombres = data.nombres.trim();
    }

    if (data.apellidos !== undefined) {
      this.apellidos = data.apellidos.trim();
    }

    if (data.telefono !== undefined) {
      this.telefono = data.telefono;
    }

    if (data.direccion !== undefined) {
      this.direccion = data.direccion;
    }

    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.estado = false;
    this.updatedAt = new Date();
  }
}
