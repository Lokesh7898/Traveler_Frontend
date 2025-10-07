import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

const handleError = (error) => {
    if (error.response) {
        console.error(`API Error: ${error.response.status} - ${error.response.data.message || error.response.data}`);
    } else if (error.request) {
        console.error(`Network Error: No response received from server.`, error.request);
    } else {
        console.error(`Request Error: ${error.message}`);
    }
    throw error;
}; 

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => handleError(error)
);

export default axiosInstance;