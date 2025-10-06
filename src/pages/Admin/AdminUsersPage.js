import React, { useState, useEffect, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import userService from '../../services/userService';
import AdminLayout from '../../components/layout/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import AppTable from '../../components/common/AppTable';

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const axiosResponse = await userService.getAllUsers();
            const apiResponseData = axiosResponse.data;
            setUsers(Array.isArray(apiResponseData.data.users) ? apiResponseData.data.users : []);
            setError(null);
        } catch (err) {
            console.error("Error in fetchUsers:", err);
            setError(err.response?.data?.message || 'Failed to fetch users.');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await userService.deleteUser(id);
                fetchUsers();
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete user.');
            }
        }
    };

    const handleEditUser = (id) => {
        alert(`Edit user with ID: ${id} - This would navigate to a user edit form.`);
    };

    const userHeaders = ['#', 'Name', 'Email', 'Role'];
    const renderUserRow = (user, index) => (
        <tr key={user._id}>
            <td>{index + 1}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
        </tr>
    );

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <AdminLayout>
            <h1 className="mb-4">Manage Users</h1>
            {error && <Alert type="danger" message={error} dismissible />}

            <AppTable
                headers={userHeaders}
                data={users}
                renderRow={renderUserRow}
                emptyMessage="No users found."
            />
        </AdminLayout>
    );
};

export default AdminUsersPage;