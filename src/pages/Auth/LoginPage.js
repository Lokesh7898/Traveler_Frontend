import React, { useState, useContext } from 'react';
import LoginForm from '../../components/forms/LoginForm';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';

const LoginPage = () => {
    const { login, loading } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleLogin = async (credentials) => {
        setError(null);
        try {
            const loggedInUser = await login(credentials.email, credentials.password);
            if (loggedInUser) {
                navigate(from, { replace: true });
            } else {
                setError('Login successful, but user data not available. Please try again.');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
            setError(errorMessage);
        }
    };

    return (
        <AuthLayout isLoginPage={true}>
            <h3 className="text-center mb-4 text-primary">Login to Your Account</h3>
            <LoginForm onSubmit={handleLogin} error={error} loading={loading} />
        </AuthLayout>
    );
};

export default LoginPage;