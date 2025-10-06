import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap'; // Removed Container
import { LinkContainer } from 'react-router-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import AdminLayout from '../../components/layout/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import bookingService from '../../services/bookingService';
import listingService from '../../services/listingService';
import userService from '../../services/userService';

const AdminDashboardPage = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        totalListings: 0,
        totalBookings: 0,
        totalUsers: 0,
        salesRevenue: [],
        bookingStatus: [],
    });

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const listingsAxiosResponse = await listingService.getListings({ status: 'all', limit: 1 });
            const bookingsAxiosResponse = await bookingService.getAllBookings();
            const usersAxiosResponse = await userService.getAllUsers();

            const listingsApiResponseData = listingsAxiosResponse.data;
            const bookingsApiResponseData = bookingsAxiosResponse.data;
            const usersApiResponseData = usersAxiosResponse.data;

            const processedSalesRevenue = {};
            const bookingStatusCounts = { paid: 0, unpaid: 0 };

            const fetchedBookings = Array.isArray(bookingsApiResponseData.data?.bookings)
                ? bookingsApiResponseData.data.bookings
                : [];

            fetchedBookings.forEach(booking => {
                const monthYear = new Date(booking.createdAt).toLocaleString('en-US', { month: 'short', year: 'numeric' });
                processedSalesRevenue[monthYear] = (processedSalesRevenue[monthYear] || 0) + booking.totalPrice;

                if (booking.paid) {
                    bookingStatusCounts.paid++;
                } else {
                    bookingStatusCounts.unpaid++;
                }
            });

            const salesRevenueChartData = Object.keys(processedSalesRevenue).map(key => ({
                name: key,
                Revenue: processedSalesRevenue[key],
            })).sort((a, b) => new Date(a.name) - new Date(b.name));

            const bookingStatusChartData = [
                { name: 'Paid', count: bookingStatusCounts.paid, fill: '#82ca9d' },
                { name: 'Unpaid', count: bookingStatusCounts.unpaid, fill: '#ffc107' },
            ];

            setDashboardData({
                totalListings: listingsApiResponseData.pagination ? listingsApiResponseData.pagination.totalResults : 0,
                totalBookings: bookingsApiResponseData.results || 0,
                totalUsers: usersApiResponseData.results || 0,
                salesRevenue: salesRevenueChartData,
                bookingStatus: bookingStatusChartData,
            });
            setError(null);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load dashboard data. Please check console for details.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    if (loading) {
        return (
            <AdminLayout>
                <LoadingSpinner />
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <Alert type="danger" message={error} dismissible />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <h1 className="mb-4">Admin Dashboard</h1>

            <Row className="g-4 mb-5">
                <Col md={6} lg={4}>
                    <Card className="admin-dashboard-card h-100">
                        <Card.Body className="d-flex flex-column justify-content-between">
                            <Card.Title as="h5" className="mb-3 text-primary d-flex align-items-center">
                                <i className="bi bi-house-door-fill me-2"></i>Manage Listings
                            </Card.Title>
                            <Card.Text className="text-muted">
                                Total Listings: <span className="fw-bold">{dashboardData.totalListings}</span>
                            </Card.Text>
                            <LinkContainer to="/admin/listings" className="mt-3">
                                <Button variant="primary" className="w-100 d-flex align-items-center justify-content-center">
                                    <i className="bi bi-arrow-right-circle me-2"></i> Go to Listings
                                </Button>
                            </LinkContainer>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} lg={4}>
                    <Card className="admin-dashboard-card h-100">
                        <Card.Body className="d-flex flex-column justify-content-between">
                            <Card.Title as="h5" className="mb-3 text-success d-flex align-items-center">
                                <i className="bi bi-calendar-check-fill me-2"></i>Manage Bookings
                            </Card.Title>
                            <Card.Text className="text-muted">
                                Total Bookings: <span className="fw-bold">{dashboardData.totalBookings}</span>
                            </Card.Text>
                            <LinkContainer to="/admin/bookings" className="mt-3">
                                <Button variant="success" className="w-100 d-flex align-items-center justify-content-center">
                                    <i className="bi bi-arrow-right-circle me-2"></i> Go to Bookings
                                </Button>
                            </LinkContainer>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} lg={4}>
                    <Card className="admin-dashboard-card h-100">
                        <Card.Body className="d-flex flex-column justify-content-between">
                            <Card.Title as="h5" className="mb-3 text-info d-flex align-items-center">
                                <i className="bi bi-people-fill me-2"></i>Manage Users
                            </Card.Title>
                            <Card.Text className="text-muted">
                                Total Users: <span className="fw-bold">{dashboardData.totalUsers}</span>
                            </Card.Text>
                            <LinkContainer to="/admin/users" className="mt-3">
                                <Button variant="info" className="w-100 d-flex align-items-center justify-content-center">
                                    <i className="bi bi-arrow-right-circle me-2"></i> Go to Users
                                </Button>
                            </LinkContainer>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="g-4">
                <Col xs={12} lg={6}>
                    <Card className="admin-dashboard-card h-100">
                        <Card.Body>
                            <Card.Title as="h5" className="mb-3 d-flex align-items-center">
                                <i className="bi bi-graph-up me-2 text-primary"></i>Sales & Revenue Overview
                            </Card.Title>
                            <p className="text-muted mb-4">Monthly revenue from bookings.</p>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={dashboardData.salesRevenue}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="Revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} lg={6}>
                    <Card className="admin-dashboard-card h-100">
                        <Card.Body>
                            <Card.Title as="h5" className="mb-3 d-flex align-items-center">
                                <i className="bi bi-bar-chart-fill me-2 text-success"></i>Booking Status Distribution
                            </Card.Title>
                            <p className="text-muted mb-4">Distribution of bookings by payment status.</p>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={dashboardData.bookingStatus}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="count" fill="#82ca9d" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </AdminLayout>
    );
};

export default AdminDashboardPage;