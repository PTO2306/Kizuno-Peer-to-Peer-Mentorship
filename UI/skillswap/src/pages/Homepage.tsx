import React from 'react';
import { Link } from 'react-router';

const Homepage: React.FC = () => {
    return (
        <div>
            <h1>Homepage</h1>
            <Link to="/login">Login Page</Link>
        </div>

    );
};

export default Homepage;