import React, { useState, useEffect, useCallback } from 'react';
import { Button, Badge } from 'react-bootstrap';
import bookingService from '../../services/bookingService';
import AdminLayout from '../../components/layout/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import { format } from 'date-fns';
import AppTable from '../../components/common/AppTable';

const AdminBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const axiosResponse = await bookingService.getAllBookings();
            const apiResponseData = axiosResponse.data;
            setBookings(Array.isArray(apiResponseData.data.bookings) ? apiResponseData.data.bookings : []);
            setError(null);
        } catch (err) {
            console.error("Error in fetchBookings:", err);
            setError(err.response?.data?.message || 'Failed to fetch bookings.');
            setBookings([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleDeleteBooking = async (id) => {
        if (window.confirm('Are you sure you want to delete this booking?')) {
            try {
                await bookingService.deleteBooking(id);
                fetchBookings();
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete booking.');
            }
        }
    };

    const bookingHeaders = ['#', 'User', 'Listing', 'Check-in', 'Check-out', 'Guests', 'Total Price', 'Status', 'Actions'];
    const renderBookingRow = (booking, index) => (
        <tr key={booking._id}>
            <td>{index + 1}</td>
            <td>{booking.user?.name || 'N/A'} ({booking.user?.email || 'N/A'})</td>
            <td>{booking.listing?.title || 'N/A'}</td>
            <td>{format(new Date(booking.checkInDate), 'PPP')}</td>
            <td>{format(new Date(booking.checkOutDate), 'PPP')}</td>
            <td>{booking.numGuests}</td>
            <td>${booking.totalPrice}</td>
            <td>
                <Badge bg={booking.paid ? 'success' : 'danger'}>
                    {booking.paid ? 'Paid' : 'Pending Payment'}
                </Badge>
            </td>
            <td>
                <Button variant="danger" size="sm" className="d-flex align-items-center" onClick={() => handleDeleteBooking(booking._id)}>
                    <i className="bi bi-trash"></i>
                </Button>
            </td>
        </tr>
    );

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <AdminLayout>
            <h1 className="mb-4">Manage Bookings</h1>
            {error && <Alert type="danger" message={error} dismissible />}

            <AppTable
                headers={bookingHeaders}
                data={bookings}
                renderRow={renderBookingRow}
                emptyMessage="No bookings found."
            />
        </AdminLayout>
    );
};

export default AdminBookingsPage;