import React, { useContext } from 'react';
import { AuthContext } from '../auth';
import ProfileScreen from '../auth/ProfileScreen';

export default function ProfileScreenWrapper({ navigation }: any) {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('ProfileScreenWrapper must be used within AuthModule');
    }

    return (
        <ProfileScreen
            navigation={navigation}
            onLogout={authContext.handleLogout}
        />
    );
}
