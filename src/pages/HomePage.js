import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HomePage = () => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (user) {
                if (user.role === 'admin') {
                    navigate('/admin', { replace: true });
                } else {
                    navigate('/listings', { replace: true });
                }
            } else {
                navigate('/login', { replace: true });
            }
        }
    }, [user, loading, navigate]);

    if (loading || !user) {
        return <LoadingSpinner />;
    }

    return null;
};

export default HomePage;