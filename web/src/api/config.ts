/**
 * API Configuration
 * Central configuration for API base URL and common settings
 */

const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) || '/api';

const TOKEN_STORAGE_KEY = 'movie-collection-token';

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
};

/**
 * Helper function to build full API URLs
 */
export function buildApiUrl(path: string): string {
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
}

/**
 * Get authentication token from localStorage
 */
export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

/**
 * Build headers with authentication token
 */
export function buildAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}
