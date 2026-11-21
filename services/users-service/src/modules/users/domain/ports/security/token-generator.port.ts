export interface TokenGeneratorPort {
  /** Genera un identificador de sesión aleatorio e impredecible. */
  generate(): string;
}

export const TOKEN_GENERATOR = Symbol('TOKEN_GENERATOR');
