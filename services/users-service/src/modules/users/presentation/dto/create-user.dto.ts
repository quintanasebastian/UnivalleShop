
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  nombres!: string;

  @IsString()
  @MinLength(2)
  apellidos!: string;

  @IsEmail()
  @Matches(/^[^\s@]+@correounivalle\.edu\.co$/i, {
    message: 'Debes utilizar un correo @correounivalle.edu.co',
  })
  correo!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsIn(['estudiante', 'docente', 'administrativo'])
  tipoUsuario!: 'estudiante' | 'docente' | 'administrativo';

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;
}
