import axios from 'axios';

const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', 
    headers: {
        'Content-Type': 'application/json'
    }
});

let authRefreshFunction: (() => Promise<boolean>) | null = null;

export const setAuthRefreshFunction = (refreshFn: () => Promise<boolean>) => {
    authRefreshFunction = refreshFn;
};

httpClient.interceptors.request.use(
    (config) => {
        return config;
    }
);

let isRefreshing = false;

httpClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response && error.response.status === 401 && authRefreshFunction && !isRefreshing) {
            isRefreshing = true;
            const refreshed = await authRefreshFunction();
            isRefreshing = false;
            
            if (refreshed) {
                return httpClient(error.config);
            }
        }
        return Promise.reject(error);
    }
);

export default httpClient;