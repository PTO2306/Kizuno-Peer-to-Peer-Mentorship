import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router';
import httpClient from '../auth/httpClient';

const OnboardingPage: React.FC = () => {
    const { user, showNotification } = useAuth();
    const navigate = useNavigate();
    
    const [profileData, setProfileData] = useState({
        displayName: '',
        bio: '',
        city: '',
        country: '',
        skills: ''  
    });
    
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const skillsArray = profileData.skills
                .split(',')
                .map(skill => skill.trim())
                .filter(skill => skill.length > 0);

            const payload = {
                displayName: profileData.displayName || undefined,
                bio: profileData.bio || undefined,
                city: profileData.city || undefined,
                country: profileData.country || undefined,
                skills: skillsArray.length > 0 ? skillsArray : undefined
            };

            const response = await httpClient.post('/user/profile', payload);
            
            if (response.status === 200) {
                showNotification('Profile created successfully! Welcome to the app!', 'success');
                navigate('/dashboard');
            }
        } catch (error: any) {
            showNotification(
                error.response?.data?.message || 'Failed to create profile. Please try again.',
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
            <h1>Complete Your Profile</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>
                Tell us a bit about yourself to get started!
            </p>
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="displayName">Display Name (Optional):</label>
                    <input
                        type="text"
                        id="displayName"
                        name="displayName"
                        value={profileData.displayName}
                        onChange={handleInputChange}
                        placeholder="How should we call you?"
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
                    <label htmlFor="bio">Bio (Optional):</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us about yourself..."
                        rows={3}
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginTop: '5px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            resize: 'vertical'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="city">City (Optional):</label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={profileData.city}
                        onChange={handleInputChange}
                        placeholder="Your city"
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
                    <label htmlFor="country">Country (Optional):</label>
                    <input
                        type="text"
                        id="country"
                        name="country"
                        value={profileData.country}
                        onChange={handleInputChange}
                        placeholder="Your country"
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginTop: '5px',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="skills">Skills (Optional):</label>
                    <input
                        type="text"
                        id="skills"
                        name="skills"
                        value={profileData.skills}
                        onChange={handleInputChange}
                        placeholder="JavaScript, React, Node.js (comma separated)"
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginTop: '5px',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    />
                    <small style={{ color: '#666', fontSize: '12px' }}>
                        Separate multiple skills with commas
                    </small>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: loading ? '#ccc' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '16px'
                    }}
                >
                    {loading ? 'Creating Profile...' : 'Complete Profile'}
                </button>
            </form>
        </div>
    );
};

export default OnboardingPage;