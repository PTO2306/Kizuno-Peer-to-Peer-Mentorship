import React, { useReducer, useContext, createContext, useEffect } from "react";
import httpClient, { setAuthRefreshFunction} from "./httpClient";


interface User {
    email: string;
    password: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
    needsOnboarding: boolean;
    notification: {
        message: string;
        type: 'success' | 'error' | 'info';
        show: boolean
    } | null; 
}

type AuthAction = 
    | { type: 'LOGIN_START' }
    | { type: 'LOGIN_SUCCESS'; payload: { user: User | null; needsOnboarding?: boolean } }
    | { type: 'LOGIN_ERROR'; payload: { error: string } }
    | { type: 'LOGOUT' }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SHOW_NOTIFICATION'; payload: { message: string; type: 'success' | 'error' | 'info' } }
    | { type: 'HIDE_NOTIFICATION' };


const initialState: AuthState = {
    loading: false,
    error: null,
    isAuthenticated: false,
    user: null,
    needsOnboarding: false,
    notification: null
}

const authReducer = (state: AuthState, action: AuthAction) => {
    switch (action.type) {
        case "LOGIN_SUCCESS" :
            return {
                ...state,
                loading: false,
                error: null,
                isAuthenticated: true,
                user: action.payload.user,
                needsOnboarding: action.payload.needsOnboarding || false
            }
        case "LOGIN_ERROR" : 
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                isAuthenticated: false,
                user: null
            }
        case "LOGOUT" :
            return {
                ...state,
                loading: false,
                error: null,
                isAuthenticated: false,
                user: null
            }
        case "SET_LOADING" :
            return {
                ...state,
                loading: action.payload
            }
        case "SHOW_NOTIFICATION" : 
            return {
                ...state,
                notification: {
                    message: action.payload.message,
                    type: action.payload.type,
                    show: true
                }
            }
        case "HIDE_NOTIFICATION" : 
            return {
                ...state,
                notification: null
            }
        default : 
            return state
    }
}


const AuthContext = createContext<any>(undefined);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
        dispatch({ type: 'SHOW_NOTIFICATION', payload: { message, type } });
    
        setTimeout(() => {
            dispatch({ type: 'HIDE_NOTIFICATION' });
        }, 3000);
    };

    const hideNotification = () => {
        dispatch({ type: 'HIDE_NOTIFICATION' });
    };

    const login = async (credentials: {email: string, password: string}) => {
        dispatch({ type: "SET_LOADING", payload: true});
        try {
            const response = await httpClient.post('/user/login', {
                email: credentials.email,
                password: credentials.password
            });

            if (response.status === 200) {
                const userResponse = await httpClient.get("/user/profile");

                if (userResponse.status === 200) {
                    dispatch({type: "LOGIN_SUCCESS", payload: { user: userResponse.data, needsOnboarding: false}});
                    showNotification('Welcome back!', 'success'); // ← Added success notification
                } else if (userResponse.status === 404) {
                    dispatch({ type: "LOGIN_SUCCESS", payload: { user: null, needsOnboarding: true}});
                    showNotification('Login successful! Please complete your profile.', 'info'); // ← Added info notification
                } else {
                    dispatch({ type: "LOGIN_ERROR", payload: { error: "Error finding user profile"}});
                    showNotification('Error loading profile. Please try again.', 'error'); // ← Added error notification
                }
            }
        } catch (error: any) {
            dispatch({ type: "LOGIN_ERROR", payload: { error: error.response?.data?.message || "Login Failed" }});
            showNotification(error.response?.data?.message || 'Login failed. Please check your credentials.', 'error'); // ← Added error notification
        }
        }

    const logout = async () => {
        try {
            await httpClient.get("/user/logout");
            dispatch({ type: "LOGOUT"});
            showNotification('Successfully logged out!', 'success'); 
        } catch {
            dispatch({type: "LOGOUT"});
            showNotification('Logged out (offline)', 'info'); 
        }
    }


    const register = async (credentials: {email: string, password: string}) => {
        dispatch({ type: "SET_LOADING", payload: true });
    
        try {
            const response = await httpClient.post("/user/register", {
                email: credentials.email,
                password: credentials.password
            });

            if (response.status === 200) {
                dispatch({ type: "SET_LOADING", payload: false });
                showNotification('Account created! Check your email to verify.', 'success');
                return { success: true, verificationToken: response.data };
            }
        } catch {
            dispatch({ type: "SET_LOADING", payload: false });
            dispatch({ type: "LOGIN_ERROR", payload: {error: "Error Creating Account Please try again"}});
            showNotification('Registration failed. Please try again.', 'error');
        }
    }


    // Add logout if false
    const refreshToken = async () => {
        try {
            const response = await httpClient.post("/user/refresh")
            if (response.status === 200) {
                return true 
            } else {
                return false
            }
        } catch {
            return false
        }
    }

    useEffect(() => {
        setAuthRefreshFunction(refreshToken)
    })
    
    const value = {
        ...state,
        login,
        logout,
        refreshToken,
        showNotification,
        hideNotification,
        register
    };
    
    return React.createElement(
        AuthContext.Provider,
        { value },
        children
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

