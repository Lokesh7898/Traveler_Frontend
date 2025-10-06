import axiosInstance from '../utils/apiResponseHandler';

const bookingService = {
    createBooking: (bookingData) => axiosInstance.post('/bookings', bookingData),
    getAllBookings: () => axiosInstance.get('/admin/bookings'),
    getMyBookings: () => axiosInstance.get('/bookings/myBookings'),
    getBookingsForListing: (listingId) => axiosInstance.get(`/bookings/listing/${listingId}`),
    getBookingById: (id) => axiosInstance.get(`/admin/bookings/${id}`),
    deleteBooking: (id) => axiosInstance.delete(`/admin/bookings/${id}`),
};

export default bookingService;