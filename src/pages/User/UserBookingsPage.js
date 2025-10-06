import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Button, Badge } from 'react-bootstrap';
import bookingService from '../../services/bookingService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import { AuthContext } from '../../context/AuthContext';
import { format } from 'date-fns';
import AppLayout from '../../components/layout/AppLayout';
import AppTable from '../../components/common/AppTable';

const UserBookingsPage = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMyBookings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const axiosResponse = await bookingService.getMyBookings();
            const apiResponseData = axiosResponse.data;
            setBookings(Array.isArray(apiResponseData.data.bookings) ? apiResponseData.data.bookings : []);
            setError(null);
        } catch (err) {
            console.error("Error in fetchMyBookings:", err);
            setError(err.response?.data?.message || 'Failed to fetch your bookings.');
            setBookings([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!authLoading && user) {
            fetchMyBookings();
        }
    }, [user, authLoading, fetchMyBookings]);

    const bookingHeaders = ['#', 'Listing', 'Host', 'Check-in', 'Check-out', 'Guests', 'Total Price', 'Status'];
    const renderBookingRow = (booking, index) => (
        <tr key={booking._id}>
            <td>{index + 1}</td>
            <td>{booking.listing?.title || 'N/A'}</td>
            <td>{booking.listing?.host?.name || 'N/A'}</td>
            <td>{format(new Date(booking.checkInDate), 'PPP')}</td>
            <td>{format(new Date(booking.checkOutDate), 'PPP')}</td>
            <td>{booking.numGuests}</td>
            <td>${booking.totalPrice}</td>
            <td>
                <Badge bg={booking.paid ? 'success' : 'danger'}>
                    {booking.paid ? 'Paid' : 'Pending'}
                </Badge>
            </td>
        </tr>
    );

    if (authLoading || loading) {
        return <LoadingSpinner />;
    }

    return (
        <AppLayout isAdmin={false}>
            <h1 className="mb-4">My Bookings</h1>
            {error && <Alert type="danger" message={error} dismissible />}

            <AppTable
                headers={bookingHeaders}
                data={bookings}
                renderRow={renderBookingRow}
                emptyMessage="You have no bookings yet."
            />
        </AppLayout>
    );
};

export default UserBookingsPage;