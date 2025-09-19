export interface User {
    id: string;
    email: string;
    username: string;
    passwordHash: string;
    createdAt: string;
    isActive: boolean;
}

export interface AuthSession {
    userId: string;
    token: string;
    expiresAt: string;
    createdAt: string;
}

export interface LoginCredentials {
    emailOrUsername: string;
    password: string;
}

export interface RegisterData {
    email: string;
    username: string;
    password: string;
}
