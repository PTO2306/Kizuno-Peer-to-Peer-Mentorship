import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import httpClient from './httpClient';
import React from 'react';
import { useNotification } from '../components/Notification';
import type { ListingModel } from '../models/userModels';

interface ListingContextType {
  userListings: ListingModel[];
  loading: boolean;
  error: string | null;
  fetchListings: () => Promise<void>;
  createListing: (
    listingData: ListingModel
  ) => Promise<{ success: boolean; data?: ListingModel }>;
  updateListing: (
    id: string,
    listingData: ListingModel
  ) => Promise<{ success: boolean; data?: ListingModel }>;
  deleteListing: (id: string) => Promise<{ success: boolean }>;
  clearListings: () => void;
}

const ListingContext = createContext<ListingContextType | undefined>(undefined);

export const ListingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { showNotification } = useNotification();
  const [userListings, setUserListings] = useState<ListingModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const clearListings = () => {
    setUserListings([]);
    setError(null);
  };

  const fetchListings = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await httpClient.get('/user/listing');
      if (response.status === 200) {
        setUserListings(response.data);
        console.log('Listings fetched successfully');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch listings';
      setError(errorMessage);
      showNotification(
        error.response?.data?.message || 'Failed to load listings',
        'error'
      );
      console.error('Fetch listings error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createListing = async (listingData: ListingModel) => {
    setLoading(true);
    setError(null);

    try {
      const response = await httpClient.post('/user/listing', listingData);

      if (response.status === 200 || response.status === 201) {
        setUserListings((prev) => [...prev, response.data]);
        setError(null);
        showNotification('Listing created successfully!', 'success');
        return { success: true, data: response.data };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to create listing';
      setError(errorMessage);
      showNotification(
        error.response?.data?.message ||
          'Failed to create listing. Please try again.',
        'error'
      );
      return { success: false };
    } finally {
      setLoading(false);
    }

    return { success: false };
  };

  const updateListing = async (id: string, listingData: ListingModel) => {
    setLoading(true);
    setError(null);

    try {
      const response = await httpClient.put(
        `/user/listing?id=${id}`,
        listingData
      );

      if (response.status === 200) {
        setUserListings((prev) =>
          prev.map((listing) => (listing.id === id ? response.data : listing))
        );
        setError(null);
        showNotification('Listing updated successfully!', 'success');
        return { success: true, data: response.data };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to update listing';
      setError(errorMessage);
      showNotification(
        error.response?.data?.message ||
          'Failed to update listing. Please try again.',
        'error'
      );
      return { success: false };
    } finally {
      setLoading(false);
    }

    return { success: false };
  };

  const deleteListing = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await httpClient.delete(`/user/listing/${id}`);

      if (response.status === 200) {
        setUserListings((prev) => prev.filter((listing) => listing.id !== id));
        setError(null);
        showNotification('Listing deleted successfully!', 'success');
        return { success: true };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to delete listing';
      setError(errorMessage);
      showNotification(
        error.response?.data?.message ||
          'Failed to delete listing. Please try again.',
        'error'
      );
      return { success: false };
    } finally {
      setLoading(false);
    }

    return { success: false };
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchListings();
    } else {
      clearListings();
    }
  }, [isAuthenticated]);

  const value: ListingContextType = {
    userListings: userListings,
    loading,
    error,
    fetchListings,
    createListing,
    updateListing,
    deleteListing,
    clearListings,
  };

  return React.createElement(ListingContext.Provider, { value }, children);
};

export const useListing = () => {
  const context = useContext(ListingContext);
  if (!context) {
    throw new Error('useListing must be used within a ListingProvider');
  }
  return context;
};
