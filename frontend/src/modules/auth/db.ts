import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';
import { User, AuthSession, LoginCredentials, RegisterData } from './types';

const USERS_STORAGE_KEY = 'auth_users';
const SESSION_STORAGE_KEY = 'auth_session';

// Hash password using crypto-js
function hashPassword(password: string): string {
    return CryptoJS.SHA256(password).toString();
}

// Generate a random token
function generateToken(): string {
    return uuidv4() + '-' + Date.now();
}

// Initialize auth storage
export async function initAuthDB() {
    const existingUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    if (!existingUsers) {
        await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
    }
}

// Get all users (internal use)
async function getUsers(): Promise<User[]> {
    const data = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Save users array
async function saveUsers(users: User[]): Promise<void> {
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

// Check if email or username exists
export async function checkUserExists(email: string, username: string): Promise<boolean> {
    const users = await getUsers();
    return users.some(user =>
        user.email.toLowerCase() === email.toLowerCase() ||
        user.username.toLowerCase() === username.toLowerCase()
    );
}

// Register new user
export async function registerUser(data: RegisterData): Promise<{ success: boolean; message: string; user?: User }> {
    try {
        const { email, username, password } = data;

        // Validate input
        if (!email || !username || !password) {
            return { success: false, message: 'All fields are required' };
        }

        if (password.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters long' };
        }

        // Check if user already exists
        const userExists = await checkUserExists(email, username);
        if (userExists) {
            return { success: false, message: 'Email or username already exists' };
        }

        // Create new user
        const user: User = {
            id: uuidv4(),
            email: email.toLowerCase(),
            username: username.toLowerCase(),
            passwordHash: hashPassword(password),
            createdAt: new Date().toISOString(),
            isActive: true
        };

        const users = await getUsers();
        users.push(user);
        await saveUsers(users);

        return { success: true, message: 'User registered successfully', user };
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, message: 'Registration failed' };
    }
}

// Login user
export async function loginUser(credentials: LoginCredentials): Promise<{ success: boolean; message: string; user?: User; session?: AuthSession }> {
    try {
        const { emailOrUsername, password } = credentials;

        if (!emailOrUsername || !password) {
            return { success: false, message: 'Email/username and password are required' };
        }

        const users = await getUsers();
        const user = users.find(u =>
            (u.email.toLowerCase() === emailOrUsername.toLowerCase() ||
             u.username.toLowerCase() === emailOrUsername.toLowerCase()) &&
            u.isActive
        );

        if (!user) {
            return { success: false, message: 'Invalid credentials' };
        }

        const hashedPassword = hashPassword(password);
        if (user.passwordHash !== hashedPassword) {
            return { success: false, message: 'Invalid credentials' };
        }

        // Create session
        const session: AuthSession = {
            userId: user.id,
            token: generateToken(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
            createdAt: new Date().toISOString()
        };

        await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

        return { success: true, message: 'Login successful', user, session };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Login failed' };
    }
}

// Get current session
export async function getCurrentSession(): Promise<AuthSession | null> {
    try {
        const sessionData = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
        if (!sessionData) return null;

        const session: AuthSession = JSON.parse(sessionData);

        // Check if session is expired
        if (new Date(session.expiresAt) < new Date()) {
            await logout();
            return null;
        }

        return session;
    } catch (error) {
        console.error('Get session error:', error);
        return null;
    }
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
    try {
        const session = await getCurrentSession();
        if (!session) return null;

        const users = await getUsers();
        return users.find(user => user.id === session.userId && user.isActive) || null;
    } catch (error) {
        console.error('Get current user error:', error);
        return null;
    }
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
    const session = await getCurrentSession();
    return session !== null;
}

// Logout user
export async function logout(): Promise<void> {
    try {
        await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Update user profile
export async function updateUserProfile(updates: Partial<Pick<User, 'email' | 'username'>>): Promise<{ success: boolean; message: string }> {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return { success: false, message: 'Not authenticated' };
        }

        const users = await getUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);

        if (userIndex === -1) {
            return { success: false, message: 'User not found' };
        }

        // Check if new email/username already exists (excluding current user)
        if (updates.email || updates.username) {
            const existingUser = users.find(u =>
                u.id !== currentUser.id && (
                    (updates.email && u.email.toLowerCase() === updates.email.toLowerCase()) ||
                    (updates.username && u.username.toLowerCase() === updates.username.toLowerCase())
                )
            );

            if (existingUser) {
                return { success: false, message: 'Email or username already exists' };
            }
        }

        // Update user
        users[userIndex] = {
            ...users[userIndex],
            ...updates,
            email: updates.email?.toLowerCase() || users[userIndex].email,
            username: updates.username?.toLowerCase() || users[userIndex].username
        };

        await saveUsers(users);
        return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
        console.error('Update profile error:', error);
        return { success: false, message: 'Update failed' };
    }
}

// Change password
export async function changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return { success: false, message: 'Not authenticated' };
        }

        if (newPassword.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters long' };
        }

        // Verify current password
        const currentHashedPassword = hashPassword(currentPassword);
        if (currentUser.passwordHash !== currentHashedPassword) {
            return { success: false, message: 'Current password is incorrect' };
        }

        // Update password
        const users = await getUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);

        if (userIndex === -1) {
            return { success: false, message: 'User not found' };
        }

        users[userIndex].passwordHash = hashPassword(newPassword);
        await saveUsers(users);

        return { success: true, message: 'Password changed successfully' };
    } catch (error) {
        console.error('Change password error:', error);
        return { success: false, message: 'Password change failed' };
    }
}
