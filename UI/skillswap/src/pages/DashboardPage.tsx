import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import httpClient from '../auth/httpClient';

const DashboardPage: React.FC = () => {
    const { user, logout, showNotification } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await httpClient.get('/user/profile');
                if (response.status === 200) {
                    setProfile(response.data);
                }
            } catch  {
                showNotification('Failed to load profile', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [showNotification]);

    const handleLogout = () => {
        logout();
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                Loading dashboard...
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '30px',
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px'
            }}>
                <div>
                    <h1>Dashboard</h1>
                    <p style={{ margin: 0, color: '#666' }}>
                        Welcome back{profile?.displayName ? `, ${profile.displayName}` : ''}!
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    style={{
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

            {/* Profile Section */}
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #dee2e6',
                marginBottom: '20px'
            }}>
                <h2>Your Profile</h2>
                {profile ? (
                    <div>
                        <p><strong>Display Name:</strong> {profile.displayName || 'Not set'}</p>
                        <p><strong>Email:</strong> {user?.email}</p>
                        <p><strong>Bio:</strong> {profile.bio || 'Not set'}</p>
                        <p><strong>Location:</strong> {profile.city && profile.country 
                            ? `${profile.city}, ${profile.country}` 
                            : profile.city || profile.country || 'Not set'}</p>
                        <p><strong>Skills:</strong> {profile.skills && profile.skills.length > 0 
                            ? profile.skills.join(', ') 
                            : 'Not set'}</p>
                        
                        <button
                            style={{
                                marginTop: '15px',
                                padding: '8px 16px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    <div>
                        <p>No profile found.</p>
                        <button
                            onClick={() => window.location.href = '/onboarding'}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Create Profile
                        </button>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #dee2e6'
            }}>
                <h2>Quick Actions</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    <div style={{
                        padding: '15px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '6px',
                        textAlign: 'center'
                    }}>
                        <h3>Feature 1</h3>
                        <p>Coming soon...</p>
                    </div>
                    <div style={{
                        padding: '15px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '6px',
                        textAlign: 'center'
                    }}>
                        <h3>Feature 2</h3>
                        <p>Coming soon...</p>
                    </div>
                    <div style={{
                        padding: '15px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '6px',
                        textAlign: 'center'
                    }}>
                        <h3>Feature 3</h3>
                        <p>Coming soon...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;