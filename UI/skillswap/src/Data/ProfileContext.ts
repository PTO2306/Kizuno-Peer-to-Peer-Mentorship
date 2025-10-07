/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from 'react';
import type { ProfileModel } from '../models/userModels';
import { useAuth } from './AuthContext';
import httpClient from './httpClient';
import React from 'react';
import { useNotification } from '../components/Notification';

interface ProfileContextType {
  profile: ProfileModel | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (profileData: FormData) => Promise<{ success: boolean }>;
  createProfile: (profileData: FormData) => Promise<{ success: boolean }>;
  clearProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { showNotification } = useNotification();
  const [profile, setProfile] = useState<ProfileModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const clearProfile = () => {
    setProfile(null);
    setError(null);
  };

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await httpClient.get('/user/profile');
      if (response.status === 200) {
        setProfile(response.data);
        console.log('Profile fetched successfully');
      } else {
        // setError('Failed to fetch profile');
        // showNotification('Failed to load profile data', 'error');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch profile';
      setError(errorMessage);
      showNotification(
        error.response?.data?.message || 'Failed to load profile data',
        'error'
      );
      console.error('Fetch profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: FormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await httpClient.put('/user/profile', profileData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        setProfile(response.data);
        setError(null);
        showNotification('Profile updated successfully!', 'success');
        return { success: true };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      showNotification(
        error.response?.data?.message ||
          'Failed to update profile. Please try again.',
        'error'
      );
      return { success: false };
    } finally {
      setLoading(false);
    }

    return { success: false };
  };

  const createProfile = async (profileData: FormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await httpClient.post('/user/profile', profileData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200 || response.status === 201) {
        setProfile(response.data);
        setError(null);
        showNotification('Profile created successfully!', 'success');
        return { success: true };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to create profile';
      setError(errorMessage);
      showNotification(
        error.response?.data?.message ||
          'Failed to create profile. Please try again.',
        'error'
      );
      return { success: false };
    } finally {
      setLoading(false);
    }

    return { success: false };
  };

  useEffect(() => {
    if (isAuthenticated && !profile) {
      fetchProfile();
    } else if (!isAuthenticated) {
      clearProfile();
    }
  }, [isAuthenticated]);

  const value: ProfileContextType = {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    createProfile,
    clearProfile,
  };

  return React.createElement(ProfileContext.Provider, { value }, children);
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
