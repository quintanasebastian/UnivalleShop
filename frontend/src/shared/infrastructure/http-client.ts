export class HttpError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

export async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, options);
  } catch (error) {
    if (options?.signal?.aborted) throw error;
    throw new Error('No pudimos conectar con el servicio. Inténtalo de nuevo en unos momentos.');
  }
  if (response.status >= 500) {
    throw new HttpError(response.status, 'El servicio no está disponible en este momento. Inténtalo de nuevo más tarde.');
  }
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.message;
    throw new HttpError(response.status, message
      ? [message].flat().join(' ')
      : 'No pudimos completar la solicitud. Revisa los datos e inténtalo de nuevo.');
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}
