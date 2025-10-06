import React from 'react';
import ClassCard from '../components/UI components/card/ClassCard';

const DashboardPage: React.FC = () => {

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
                        avatar={''}
                        title='Developer interview practice'
                        mentor='Coding Jesus'
                        subtitle='Brush up on your interview skills with an experienced SWE'
                        desc='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla lobortis ultrices felis, ac sodales purus cursus vel. Suspendisse vitae vestibulum odio. Integer sem dui, rutrum sit amet arcu vitae sed.'
                    />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;