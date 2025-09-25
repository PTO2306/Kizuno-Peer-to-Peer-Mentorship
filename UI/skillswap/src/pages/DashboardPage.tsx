import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import httpClient from '../auth/httpClient';
import ClassCard from '../components/UI components/card/ClassCard';
import CardMedia from '../assets/skill-card-placeholder.jpg';
import CardMedia2 from '../assets/skill-card-placeholder2.jpg';
import CardMedia3 from '../assets/skill-card-placeholder3.jpg';
import NavBar from '../components/UI components/navbar/NavBar';
 
const DashboardPage: React.FC = () => {
    const { user, showNotification } = useAuth();
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

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                Loading dashboard...
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <NavBar />
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
                    <div className="flex flex-wrap gap-4 max-h-[80vh] overflow-y-auto p-4">
                    <ClassCard 
                        media={CardMedia}
                        title='Terrarium Workshop'
                        mentor='Michael Scott'
                        desc='Join our terrarium workshop!'
                        level='beginner'
                    />
                    <ClassCard 
                        media={CardMedia2}
                        title='Dota 2 Coaching'
                        mentor='Liz Mouton'
                        desc='Coaching for position 4'
                        level='intermediate'
                    />
                    <ClassCard 
                        media={CardMedia3}
                        title='Frontend Developer Support'
                        mentor='Chanel Brits'
                        desc='Get support from a senior frontend dev'
                        level='advanced'
                    />
                                        <ClassCard 
                        media={CardMedia}
                        title='Terrarium Workshop'
                        mentor='Michael Scott'
                        desc='Join our terrarium workshop!'
                        level='beginner'
                    />
                    <ClassCard 
                        media={CardMedia2}
                        title='Dota 2 Coaching'
                        mentor='Liz Mouton'
                        desc='Coaching for position 4'
                        level='intermediate'
                    />
                    <ClassCard 
                        media={CardMedia3}
                        title='Frontend Developer Support'
                        mentor='Chanel Brits'
                        desc='Get support from a senior frontend dev'
                        level='advanced'
                    />
                                        <ClassCard 
                        media={CardMedia}
                        title='Terrarium Workshop'
                        mentor='Michael Scott'
                        desc='Join our terrarium workshop!'
                        level='beginner'
                    />
                    <ClassCard 
                        media={CardMedia2}
                        title='Dota 2 Coaching'
                        mentor='Liz Mouton'
                        desc='Coaching for position 4'
                        level='intermediate'
                    />
                    <ClassCard 
                        media={CardMedia3}
                        title='Frontend Developer Support'
                        mentor='Chanel Brits'
                        desc='Get support from a senior frontend dev'
                        level='advanced'
                    />
                                        <ClassCard 
                        media={CardMedia}
                        title='Terrarium Workshop'
                        mentor='Michael Scott'
                        desc='Join our terrarium workshop!'
                        level='beginner'
                    />
                    <ClassCard 
                        media={CardMedia2}
                        title='Dota 2 Coaching'
                        mentor='Liz Mouton'
                        desc='Coaching for position 4'
                        level='intermediate'
                    />
                    <ClassCard 
                        media={CardMedia3}
                        title='Frontend Developer Support'
                        mentor='Chanel Brits'
                        desc='Get support from a senior frontend dev'
                        level='advanced'
                    />
                    </div>
            </div>
        </div>
    );
};

export default DashboardPage;