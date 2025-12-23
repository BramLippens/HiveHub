import { buildApiUrl } from './config';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '../types/auth.types';

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(buildApiUrl('auth/register'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `HTTP error! status: ${response.status}`);
    }

    const result: unknown = await response.json();
    return result as AuthResponse;
  } catch (error) {
    console.error('Failed to register:', error);
    throw error;
  }
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(buildApiUrl('auth/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `HTTP error! status: ${response.status}`);
    }

    const result: unknown = await response.json();
    return result as AuthResponse;
  } catch (error) {
    console.error('Failed to login:', error);
    throw error;
  }
}

export async function getCurrentUser(token: string): Promise<User> {
  try {
    const response = await fetch(buildApiUrl('auth/me'), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: unknown = await response.json();
    return result as User;
  } catch (error) {
    console.error('Failed to get current user:', error);
    throw error;
  }
}
