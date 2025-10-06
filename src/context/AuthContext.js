import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import axiosInstance from '../utils/apiResponseHandler';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkTokenValidity = useCallback(async () => {
        const token = localStorage.getItem('jwt');
        if (token) {
            try {
                const axiosResponse = await axiosInstance.get('/users/me');
                const apiResponseData = axiosResponse.data;
                if (apiResponseData.status === 'success') {
                    setUser(apiResponseData.data.user);
                } else {
                    localStorage.removeItem('jwt');
                    setUser(null);
                }
            } catch (error) {
                localStorage.removeItem('jwt');
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        checkTokenValidity();
    }, [checkTokenValidity]);

    const login = useCallback(async (email, password) => {
        setLoading(true);
        try {
            const axiosResponse = await authService.login(email, password);
            const responseData = axiosResponse.data;
            localStorage.setItem('jwt', responseData.token);
            const loggedInUser = responseData.data.user;
            setUser(loggedInUser);
            return loggedInUser;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const register = useCallback(async (name, email, password, role) => {
        setLoading(true);
        try {
            const axiosResponse = await authService.register(name, email, password, role);
            const responseData = axiosResponse.data;
            localStorage.setItem('jwt', responseData.token);
            const registeredUser = responseData.data.user;
            setUser(registeredUser);
            return registeredUser;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('jwt');
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };