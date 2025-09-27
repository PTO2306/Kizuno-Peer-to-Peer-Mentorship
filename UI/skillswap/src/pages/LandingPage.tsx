// pages/LandingPage.tsx
import React from 'react';
import { Link } from 'react-router';

const LandingPage: React.FC = () => {
    return (
        <div style={{ 
            textAlign: 'center', 
            padding: '50px', 
            maxWidth: '600px', 
            margin: '0 auto' 
        }}>
            <h1>Welcome to Our Sick App</h1>
            
            <div style={{ marginTop: '40px' }}>
                <Link 
                    to="/register"
                    style={{
                        display: 'inline-block',
                        margin: '10px',
                        padding: '15px 30px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '5px'
                    }}
                >
                    Get Started
                </Link>
                
                <Link 
                    to="/login"
                    style={{
                        display: 'inline-block',
                        margin: '10px',
                        padding: '15px 30px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '5px'
                    }}
                >
                    Login
                </Link>
            </div>
        </div>
    );
};

export default LandingPage;