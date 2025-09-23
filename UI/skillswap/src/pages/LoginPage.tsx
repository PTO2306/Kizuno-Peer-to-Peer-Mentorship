import React, { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../auth/AuthContext';

const LoginPage: React.FC = () => {
    const { login, logout, isAuthenticated, loading, error, user, needsOnboarding } = useAuth();
    const [credentials, setCredentials] = useState({ email: '', password: '' });


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login(credentials);
    };

    const handleLogout = () => {
        logout();
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            {!isAuthenticated ? (
                <>
                    <h1>Login to your account</h1>
                    
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={credentials.email}
                                onChange={handleInputChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    marginTop: '5px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleInputChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    marginTop: '5px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px'
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Login
                        </button>
                    </form>

                    {error && (
                        <div style={{ 
                            marginTop: '15px', 
                            padding: '10px', 
                            backgroundColor: '#f8d7da', 
                            color: '#721c24', 
                            border: '1px solid #f5c6cb',
                            borderRadius: '4px' 
                        }}>
                            {error}
                        </div>
                    )}

                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <Link to="/register">Don't have an account? Register here</Link>
                    </div>
                </>
            ) : (
                <div style={{ textAlign: 'center' }}>
                    <h2>✅ Welcome back!</h2>
                    {needsOnboarding ? (
                        <div>
                            <p>⚠️ Complete your profile to get started</p>
                            <Link to="/onboarding">Complete Profile</Link>
                        </div>
                    ) : (
                        <div>
                            <p>👤 {user?.email || 'User'}</p>
                            <Link to="/dashboard">Go to Dashboard</Link>
                        </div>
                    )}
                    <button 
                        onClick={handleLogout}
                        style={{
                            marginTop: '20px',
                            padding: '10px 20px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default LoginPage;