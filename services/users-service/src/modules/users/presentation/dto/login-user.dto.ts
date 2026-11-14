import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @Matches(/^[^\s@]+@correounivalle\.edu\.co$/i, {
    message: 'Debes utilizar un correo @correounivalle.edu.co',
  })
  correo!: string;

  @IsString()
  @MinLength(1)
  password!: string;
}
