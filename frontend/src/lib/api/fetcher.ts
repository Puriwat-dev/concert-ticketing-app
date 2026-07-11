const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown; 
}

export async function fetcher<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { body, headers } = options;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    method: body ? 'POST' : 'GET',
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      let errorMessage = 'An error occurred while processing your request.';
      
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMessage = Array.isArray(errorData.message)
            ? errorData.message[0]
            : errorData.message;
        }
      } catch {
        errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
      }

      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('A network connection error occurred.');
  }
}
