const API_BASE_URL = '/api';

export async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('casaviva_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.toLowerCase().includes('application/json')) {
      throw new Error('La API no respondió correctamente. Revisa la configuración de Vercel.');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error del servidor (${response.status})`);
    }

    return data;
  } catch (error: any) {
    if (error.message && error.message.includes('Failed to fetch')) {
      throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.');
    }
    throw error;
  }
}
