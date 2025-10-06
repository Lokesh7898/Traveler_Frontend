import React, { useState, useContext } from 'react';
import RegisterForm from '../../components/forms/RegisterForm';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';

const RegisterPage = () => {
    const { register, loading } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (userData) => {
        setError(null);
        try {
            const registeredUser = await register(userData.name, userData.email, userData.password, userData.role);
            if (registeredUser) {
                navigate('/');
            } else {
                setError('Registration successful, but user data not available. Please try again.');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Registration failed.');
        }
    };

    return (
        <AuthLayout isLoginPage={false}>
            <h3 className="text-center mb-4 text-primary">Create Your Account</h3>
            <RegisterForm onSubmit={handleRegister} error={error} loading={loading} />
        </AuthLayout>
    );
};

export default RegisterPage;