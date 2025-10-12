/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useState,
  useContext,
  createContext,
  useEffect,
  useRef,
} from 'react';
import * as signalR from '@microsoft/signalr';
import { useAuth } from './AuthContext';
import httpClient from './httpClient';

interface NotificationModel {
  message: string;
  timestamp: string;
  isRead: boolean;
  senderName: string;
  profilePicUrl: string;
}

interface SignalRContextType {
  connection: signalR.HubConnection | null;
  isConnected: boolean;
  notifications: NotificationModel[];
  getNotifications: () => Promise<NotificationModel[]>;
  markAllAsRead: () => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
  // clearNotifications: () => void;
}

const SignalRContext = createContext<SignalRContextType | undefined>(undefined);

export const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  const getNotifications = async () => {
    const response = await httpClient.get('/user/notifications');

    if (response.status === 200) {
      setNotifications(response.data);
      return response.data;
    } else {
      console.error('Failed to fetch notifications');
      return [];
    }
  };

  const markAllAsRead = async () => {
    const response = await httpClient.put('/user/notifications');

    if (response.status === 200) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } else {
      console.error('Failed to mark notifications as read');
    }
  };

  const deleteAllNotifications = async () => {
    const response = await httpClient.delete('/user/notifications');

    if (response.status === 200) {
      setNotifications([]);
    } else {
      console.error('Failed to delete notifications');
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
        setIsConnected(false);
        setNotifications([]);
      }
      return;
    }

    const hubUrl = `${import.meta.env.VITE_API_URL}/notificationHub`;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        withCredentials: true,
        skipNegotiation: false,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.elapsedMilliseconds < 60000) {
            return Math.min(
              1000 * Math.pow(2, retryContext.previousRetryCount),
              10000
            );
          }
          return null;
        },
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.on('ReceiveNotification', (notification: NotificationModel) => {
      console.log('Notification received:', notification);
      setNotifications((prev) => [notification, ...prev]);
    });

    connection.onreconnecting((error) => {
      console.log('SignalR reconnecting...', error);
      setIsConnected(false);
    });

    connection.onreconnected((connectionId) => {
      console.log('SignalR reconnected:', connectionId);
      setIsConnected(true);
    });

    connection.onclose((error) => {
      console.log('SignalR connection closed:', error);
      setIsConnected(false);
    });

    const startConnection = async () => {
      try {
        await connection.start();
        console.log('SignalR connected');
        setIsConnected(true);
        connectionRef.current = connection;
      } catch (err) {
        console.error('SignalR connection error:', err);
        setIsConnected(false);
        setTimeout(startConnection, 5000);
      }
    };

    startConnection();

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [isAuthenticated]);

  // const clearNotifications = () => {
  //   setNotifications([]);
  // };

  const value: SignalRContextType = {
    connection: connectionRef.current,
    isConnected,
    notifications,
    getNotifications,
    markAllAsRead,
    deleteAllNotifications,
    // clearNotifications,
  };

  return React.createElement(SignalRContext.Provider, { value }, children);
};

export const useSignalR = () => {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error('useSignalR must be used within a SignalRProvider');
  }
  return context;
};
