const API_BASE = '/api';

export async function obtenerProductos(categoria = '', signal) {
  const query = categoria
    ? `?categoria=${encodeURIComponent(categoria)}`
    : '';

  const response = await fetch(`${API_BASE}/products${query}`, { signal });

  if (!response.ok) {
    throw new Error(`El servicio de catálogo respondió con HTTP ${response.status}.`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('La respuesta del catálogo no tiene el formato esperado.');
  }

  return data;
}

export async function obtenerProductoPorId(id, signal) {
  const response = await fetch(`${API_BASE}/products/${encodeURIComponent(id)}`, { signal });

  if (!response.ok) {
    throw new Error('No fue posible consultar el producto.');
  }

  return response.json();
}
