import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ListingsPage from './pages/Listings/ListingsPage';
import ListingDetailPage from './pages/Listings/ListingDetailPage';
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import AdminListingsPage from './pages/Admin/AdminListingsPage';
import AdminListingFormPage from './pages/Admin/AdminListingFormPage';
import AdminUsersPage from './pages/Admin/AdminUsersPage';
import AdminBookingsPage from './pages/Admin/AdminBookingsPage';
import UserProfilePage from './pages/User/UserProfilePage';
import UserBookingsPage from './pages/User/UserBookingsPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';
import HomePage from './pages/HomePage';

function App() {
    const location = useLocation();
    const noHeaderFooterPaths = ['/login', '/register'];
    const showHeaderFooter = !noHeaderFooterPaths.includes(location.pathname);

    return (
        <div className="d-flex flex-column min-vh-100">
            {showHeaderFooter && <Navbar />}

            {noHeaderFooterPaths.includes(location.pathname) ? (
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            ) : (
                <div className="app-layout-wrapper flex-grow-1">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/listings" element={<ListingsPage />} />
                        <Route path="/listings/:id" element={<ListingDetailPage />} />

                        <Route path="/profile" element={
                            <PrivateRoute>
                                <UserProfilePage />
                            </PrivateRoute>
                        } />
                        <Route path="/user/bookings" element={
                            <PrivateRoute>
                                <UserBookingsPage />
                            </PrivateRoute>
                        } />

                        <Route path="/admin" element={
                            <AdminRoute>
                                <AdminDashboardPage />
                            </AdminRoute>
                        } />
                        <Route path="/admin/listings" element={
                            <AdminRoute>
                                <AdminListingsPage />
                            </AdminRoute>
                        } />
                        <Route path="/admin/listings/new" element={
                            <AdminRoute>
                                <AdminListingFormPage />
                            </AdminRoute>
                        } />
                        <Route path="/admin/listings/edit/:id" element={
                            <AdminRoute>
                                <AdminListingFormPage />
                            </AdminRoute>
                        } />
                        <Route path="/admin/users" element={
                            <AdminRoute>
                                <AdminUsersPage />
                            </AdminRoute>
                        } />
                        <Route path="/admin/bookings" element={
                            <AdminRoute>
                                <AdminBookingsPage />
                            </AdminRoute>
                        } />

                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </div>
            )}

            {showHeaderFooter && <Footer />}
        </div>
    );
}

export default App;