export function institutionalEmail(value: string): string {
  const email = value.trim().toLowerCase();
  if (!/^[^\s@]+@correounivalle\.edu\.co$/.test(email)) {
    throw new Error('Usa un correo @correounivalle.edu.co.');
  }
  return email;
}
