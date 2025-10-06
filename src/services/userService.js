import axiosInstance from '../utils/apiResponseHandler';

const userService = {
    getMe: () => axiosInstance.get('/users/me'),
    updateMe: (userData) => axiosInstance.patch('/users/updateMe', userData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    getAllUsers: () => axiosInstance.get('/admin/users'),
    getUserById: (id) => axiosInstance.get(`/admin/users/${id}`),
    updateUser: (id, userData) => axiosInstance.patch(`/admin/users/${id}`, userData),
    deleteUser: (id) => axiosInstance.delete(`/admin/users/${id}`),
};

export default userService;