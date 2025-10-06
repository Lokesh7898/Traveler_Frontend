import React from 'react';
import AppLayout from '../layout/AppLayout';

const AdminLayout = ({ children }) => {
    return (
        <AppLayout isAdmin={true}>
            {children}
        </AppLayout>
    );
};

export default AdminLayout;