import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../auth/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireProfile?: boolean; // Optional: require completed profile
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
    children, 
    requireProfile = false 
}) => {
    const { isAuthenticated, loading, needsOnboarding } = useAuth();
    
    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (needsOnboarding && requireProfile) {
        return <Navigate to="/onboarding" />;
    }
    

    return <>{children}</>;
};

export default ProtectedRoute;