import React, { useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';

const Notification: React.FC = () => {
    const { notification, hideNotification } = useAuth();

    useEffect(() => {
        if (notification?.show) {
            const timer = setTimeout(() => {
                hideNotification();
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [notification, hideNotification]);

    if (!notification?.show) {
        return null;
    }

    const getNotificationStyle = () => {
        const baseStyle = {
            position: 'fixed' as const,
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: 'bold',
            // Ensure the notification appears above the MUI AppBar/menus
            zIndex: 2000,
            minWidth: '300px',
            cursor: 'pointer'
        };

        const typeStyles = {
            success: { backgroundColor: '#28a745' },
            error: { backgroundColor: '#dc3545' },
            info: { backgroundColor: '#17a2b8' }
        };

        return { ...baseStyle, ...typeStyles[notification.type] };
    };

    return (
        <div 
            style={getNotificationStyle()}
            onClick={hideNotification}
        >
            {notification.message}
        </div>
    );
};

export default Notification;