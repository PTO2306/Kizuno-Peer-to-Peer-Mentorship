import React from "react";
import { useProfile } from "../auth/ProfileContext";

const ProfilePage: React.FC = () => {
    const { profile } = useProfile();

    return (
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
                        <p><strong>Email:</strong> {profile?.email}</p>
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
    )
}

export default ProfilePage;