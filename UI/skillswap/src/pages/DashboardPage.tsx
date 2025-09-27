import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import ClassCard from '../components/UI components/card/ClassCard';
import CardMedia from '../assets/skill-card-placeholder.jpg';
import CardMedia2 from '../assets/skill-card-placeholder2.jpg';
import CardMedia3 from '../assets/skill-card-placeholder3.jpg';

const DashboardPage: React.FC = () => {
    const { logout, showNotification } = useAuth();
    const [loading, setLoading] = useState(false);

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
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
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
                        {/* Welcome back{profile?.displayName ? `, ${profile.displayName}` : ''}! */}
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