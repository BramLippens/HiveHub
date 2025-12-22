/**
 * API Configuration
 * Central configuration for API base URL and common settings
 */

const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) || '/api';

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
