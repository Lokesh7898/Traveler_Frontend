import React from 'react';
import Sidebar from '../common/Sidebar';

const AppLayout = ({ children, isAdmin = false }) => {
    return (
        <div className="app-layout-wrapper">
            <Sidebar isAdmin={isAdmin} />
            <div className="main-content-wrapper">
                {children}
            </div>
        </div>
    );
};

export default AppLayout;