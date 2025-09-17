import React from 'react';
import { Link } from 'react-router';


const Login: React.FC = () => {
    return (
        <div>
            <h1>Login Page</h1>
            <Link to="/">Homepage</Link>
        </div>
    );
};

export default Login;