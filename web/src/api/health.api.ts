/**
 * Health Check API
 * Simple API endpoint for testing backend connectivity
 */

import { buildApiUrl } from './config';

export interface HealthResponse {
  message: string;
  timestamp?: string;
}

/**
 * Check if the API backend is reachable
 */
export async function getHealthStatus(): Promise<HealthResponse> {
  try {
    const response = await fetch(buildApiUrl(''));

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: unknown = await response.json();
    return data as HealthResponse;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
}
