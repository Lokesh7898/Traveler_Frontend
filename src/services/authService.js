import axiosInstance from '../utils/apiResponseHandler';

const authService = {
    register: (name, email, password, role) => axiosInstance.post('/register', { name, email, password, role }),
    login: (email, password) => axiosInstance.post('/login', { email, password }),
    logout: () => axiosInstance.get('/logout'),
};

export default authService;