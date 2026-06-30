const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const apiFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const headers = new Headers(options.headers || {});
  
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  
  // Set default content type if body is not FormData
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  // Handle automatic token refresh on 401 Unauthorized
  if (response.status === 401 && !endpoint.includes('/auth/refresh') && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
    try {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        accessToken = data.accessToken;
        
        // Retry the original request with the new access token
        headers.set('Authorization', `Bearer ${accessToken}`);
        return fetch(`${BASE_URL}${endpoint}`, {
          ...options,
          headers
        });
      } else {
        accessToken = null;
      }
    } catch (err) {
      accessToken = null;
    }
  }

  return response;
};
