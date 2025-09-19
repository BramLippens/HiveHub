import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';
import { isAuthenticated, initAuthDB, logout } from './db';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import ProfileScreen from './ProfileScreen';

const Stack = createStackNavigator();

interface AuthModuleProps {
    children: React.ReactNode;
    onAuthStateChange?: (isAuth: boolean) => void;
}

// Create a context to provide the logout handler to child components
export const AuthContext = React.createContext<{
    handleLogout: () => Promise<void>;
} | null>(null);

export default function AuthModule({ children, onAuthStateChange }: AuthModuleProps) {
    const [isAuth, setIsAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        try {
            await initAuthDB();
            const authStatus = await isAuthenticated();
            setIsAuth(authStatus);
            onAuthStateChange?.(authStatus);
        } catch (error) {
            console.error('Auth initialization error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginSuccess = async () => {
        setIsAuth(true);
        onAuthStateChange?.(true);
    };

    const handleLogout = async () => {
        try {
            await logout(); // Actually clear the session from storage
            setIsAuth(false);
            onAuthStateChange?.(false);
        } catch (error) {
            console.error('Logout error:', error);
            // Even if logout fails, we should still update the UI state
            setIsAuth(false);
            onAuthStateChange?.(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    if (!isAuth) {
        return (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login">
                    {(props) => (
                        <LoginScreen
                            {...props}
                            onLoginSuccess={handleLoginSuccess}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen name="Register" component={RegisterScreen} />
            </Stack.Navigator>
        );
    }

    // Provide the logout handler to child components through context
    return (
        <AuthContext.Provider value={{ handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Export the ProfileScreen component to be used in other navigators
export { ProfileScreen };

// Export authentication functions for use in other modules
export {
    isAuthenticated,
    getCurrentUser,
    logout,
    getCurrentSession
} from './db';

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        fontSize: 18,
        color: '#666',
    },
});
