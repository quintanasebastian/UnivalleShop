const INSTITUTIONAL_EMAIL = /^[^\s@]+@correounivalle\.edu\.co$/;

/**
 * Regla de negocio única: solo personas vinculadas a Univalle.
 * Devuelve el correo normalizado o lanza un error si no es institucional.
 */
export function normalizeInstitutionalEmail(raw: string): string {
  const correo = raw.trim().toLowerCase();

  if (!INSTITUTIONAL_EMAIL.test(correo)) {
    throw new Error('El correo debe ser institucional de Univalle.');
  }

  return correo;
}
