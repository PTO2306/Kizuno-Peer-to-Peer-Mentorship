/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let authRefreshFunction: (() => Promise<boolean>) | null = null;
let logoutFunction: (() => void) | null = null;

export const setAuthRefreshFunction = (refreshFn: () => Promise<boolean>) => {
  authRefreshFunction = refreshFn;
};

export const setLogoutFunction = (logoutFn: () => void) => {
  logoutFunction = logoutFn;
};

httpClient.interceptors.request.use((config) => {
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    // prevent refresh loop
    const isRefreshRequest = originalRequest.url?.includes('/refresh');

    if (
      error.response?.status === 401 &&
      !isRefreshRequest &&
      !originalRequest._retry &&
      authRefreshFunction
    ) {
      console.log('401 error - attempting token refresh');

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return httpClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshed = await authRefreshFunction();

        if (refreshed) {
          processQueue(null, 'success');
          isRefreshing = false;

          return httpClient(originalRequest);
        } else {
          processQueue(new Error('Token refresh failed'), null);
          isRefreshing = false;

          if (logoutFunction) {
            logoutFunction();
          }

          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        if (logoutFunction) {
          logoutFunction();
        }

        if (error.response.status === 401 && isRefreshRequest) {
          if (logoutFunction) logoutFunction();
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;
