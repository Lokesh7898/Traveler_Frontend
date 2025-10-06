import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Image, ListGroup, Badge, Button, Form, Card, Modal } from 'react-bootstrap';
import listingService from '../../services/listingService';
import bookingService from '../../services/bookingService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import { format, differenceInDays, addDays, isSameDay, isBefore } from 'date-fns';
import defaultListingImage from '../../assets/images/listing-placeholder.jpg';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AuthContext } from '../../context/AuthContext';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const ListingDetailPage = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [numGuests, setNumGuests] = useState(1);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState(null);
    const [allBookedDates, setAllBookedDates] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const fetchBookingsForListing = useCallback(async () => {
        try {
            console.log(`[FRONTEND] fetchBookingsForListing: Calling API for listing ID: ${id}`);
            const axiosResponse = await bookingService.getBookingsForListing(id);

            console.log('[FRONTEND] Booking API raw response:', axiosResponse?.data);

            const apiResponseData = axiosResponse.data;

            const allBookings = Array.isArray(apiResponseData?.data?.bookings)
                ? apiResponseData.data.bookings
                : Array.isArray(apiResponseData?.bookings)
                    ? apiResponseData.bookings
                    : Array.isArray(apiResponseData)
                        ? apiResponseData
                        : [];

            console.log(`[FRONTEND] fetchBookingsForListing: Raw bookings for listing ${id}:`, allBookings);

            const bookedDates = [];

            allBookings.forEach(booking => {
                const rawCheckIn = booking.checkInDate ?? booking.check_in ?? booking.startDate ?? booking.start;
                const rawCheckOut = booking.checkOutDate ?? booking.check_out ?? booking.endDate ?? booking.end;

                if (!rawCheckIn || !rawCheckOut) {
                    console.warn('[FRONTEND] Skipping booking with missing dates:', booking);
                    return;
                }

                let currentDate = new Date(rawCheckIn);
                currentDate.setHours(0, 0, 0, 0);
                const endDate = new Date(rawCheckOut);
                endDate.setHours(0, 0, 0, 0);

                while (isBefore(currentDate, endDate)) {
                    bookedDates.push(new Date(currentDate));
                    currentDate = addDays(currentDate, 1);
                }
            });

            setAllBookedDates(bookedDates);
            console.log(`[FRONTEND] fetchBookingsForListing: Calculated allBookedDates for listing ${id}:`, bookedDates);
            console.log(`[FRONTEND] Number of individual booked dates: ${bookedDates.length}`);
        } catch (err) {
            console.error(`[FRONTEND] Failed to fetch existing bookings for listing ${id} calendar:`, err);
        }
    }, [id]);

    useEffect(() => {
        const fetchListingAndBookings = async () => {
            setLoading(true);
            try {
                console.log(`[FRONTEND] fetchListingAndBookings: Calling API for listing details ID: ${id}`);
                const axiosResponse = await listingService.getListingById(id);
                const apiResponseData = axiosResponse.data;
                setListing(apiResponseData.data.listing);
                setError(null);

                await fetchBookingsForListing();

            } catch (err) {
                console.error(`[FRONTEND] Error in fetchListingAndBookings for listing ID: ${id}:`, err);
                setError(err.response?.data?.message || 'Failed to fetch listing details.');
            } finally {
                setLoading(false);
            }
        };

        fetchListingAndBookings();
    }, [id, fetchBookingsForListing]);


    const calculateTotalPrice = () => {
        if (checkInDate && checkOutDate && listing?.price) {
            const days = differenceInDays(checkOutDate, checkInDate);
            return days > 0 ? days * listing.price : 0;
        }
        return 0;
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setBookingLoading(true);
        setBookingError(null);

        if (!user) {
            setBookingError('You must be logged in to book.');
            setBookingLoading(false);
            return;
        }
        if (!checkInDate || !checkOutDate || numGuests < 1) {
            setBookingError('Please fill all booking details.');
            setBookingLoading(false);
            return;
        }
        if (isBefore(checkOutDate, checkInDate) || isSameDay(checkOutDate, checkInDate)) {
            setBookingError('Check-out date must be after check-in date.');
            setBookingLoading(false);
            return;
        }
        const todayAtMidnight = new Date();
        todayAtMidnight.setHours(0, 0, 0, 0);
        if (isBefore(checkInDate, todayAtMidnight) && !isSameDay(checkInDate, todayAtMidnight)) {
            setBookingError('Check-in date cannot be in the past.');
            setBookingLoading(false);
            return;
        }

        if (numGuests > listing.maxGuests) {
            setBookingError(`Number of guests cannot exceed ${listing.maxGuests}.`);
            setBookingLoading(false);
            return;
        }

        let tempCurrentDate = new Date(checkInDate);
        while (isBefore(tempCurrentDate, checkOutDate)) {
            if (allBookedDates.some(bookedDate => isSameDay(bookedDate, tempCurrentDate))) {
                setBookingError('Selected date range overlaps with an existing booking.');
                setBookingLoading(false);
                return;
            }
            tempCurrentDate = addDays(tempCurrentDate, 1);
        }

        const totalPrice = calculateTotalPrice();

        try {
            await bookingService.createBooking({
                listingId: listing._id,
                checkInDate: checkInDate.toISOString(),
                checkOutDate: checkOutDate.toISOString(),
                numGuests,
                totalPrice,
            });
            setModalMessage('Congratulations! Your booking was successful. You can view it in "My Bookings" page.');
            setShowModal(true);

            setCheckInDate(null);
            setCheckOutDate(null);
            setNumGuests(1);
            await fetchBookingsForListing();

        } catch (err) {
            console.error("[FRONTEND] Error in handleBookingSubmit:", err);
            setBookingError(err.response?.data?.message || 'Booking failed. Please try again.');
        } finally {
            setBookingLoading(false);
        }
    };

    const isDateDisabled = (date) => {
        const dateToCheck = new Date(date);
        dateToCheck.setHours(0, 0, 0, 0);

        const isBooked = allBookedDates.some(bookedDate => {
            const bd = new Date(bookedDate);
            bd.setHours(0, 0, 0, 0);
            return isSameDay(bd, dateToCheck);
        });

        return !isBooked;
    };

    const todayForMinDate = new Date();
    todayForMinDate.setHours(0, 0, 0, 0);


    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <Container className="my-5"><Alert type="danger" message={error} dismissible /></Container>;
    }

    if (!listing) {
        return <Container className="my-5"><Alert type="info" message="Listing not found." /></Container>;
    }

    const defaultImage = defaultListingImage;
    const validImages = listing.images && Array.isArray(listing.images)
        ? listing.images.filter(img => img && img.trim() !== '')
        : [];
    const primaryImage = validImages.length > 0
        ? `${process.env.REACT_APP_API_BASE_URL.replace('/api/v1', '')}${validImages[0]}`
        : defaultImage;

    return (
        <Container className="my-5">
            <Row>
                <Col md={8}>
                    <Image src={primaryImage} fluid rounded className="mb-4 shadow-sm" />

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2>{listing.title}</h2>
                        <Badge bg="info">{listing.tourType}</Badge>
                    </div>
                    <p className="lead">{listing.description}</p>

                    <hr />

                    <h4 className="mb-3">Amenities</h4>
                    <Row className="mb-4">
                        {listing.amenities && listing.amenities.length > 0 ? (
                            listing.amenities.map((amenity, index) => (
                                <Col xs={6} sm={4} lg={3} key={index} className="mb-2">
                                    <Badge pill bg="secondary" className="p-2">
                                        <i className={`bi bi-${amenity.toLowerCase().replace(' ', '-')}-fill me-1`}></i>
                                        {amenity}
                                    </Badge>
                                </Col>
                            ))
                        ) : (
                            <Col><p className="text-muted">No amenities listed.</p></Col>
                        )}
                    </Row>

                </Col>
                <Col md={4}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-3">Booking Details</Card.Title>
                            <h3 className="mb-3">${listing.price || 0} <small className="text-muted">/ night</small></h3>
                            <ListGroup variant="flush" className="mb-3">
                                <ListGroup.Item>
                                    <i className="bi bi-people-fill me-2"></i>Max Guests: {listing.maxGuests || 0}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <i className="bi bi-geo-alt-fill me-2"></i>Location: {listing.location}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <i className="bi bi-star-fill text-warning me-2"></i>Rating: {listing.ratingsAverage || 0} ({listing.ratingsQuantity || 0} reviews)
                                </ListGroup.Item>
                                {listing.host && (
                                    <ListGroup.Item>
                                        <i className="bi bi-person-fill me-2"></i>Hosted by: {listing.host.name}
                                    </ListGroup.Item>
                                )}
                            </ListGroup>

                            <hr />
                            <h5>Book this listing</h5>
                            {bookingError && <Alert type="danger" message={bookingError} dismissible onClose={() => setBookingError(null)} />}

                            <Form onSubmit={handleBookingSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Check-in Date</Form.Label>
                                    <DatePicker
                                        selected={checkInDate}
                                        onChange={(date) => setCheckInDate(date)}
                                        selectsStart
                                        startDate={checkInDate}
                                        endDate={checkOutDate}
                                        minDate={todayForMinDate}
                                        dateFormat="yyyy-MM-dd"
                                        className="form-control"
                                        placeholderText="Select check-in"
                                        required
                                        filterDate={isDateDisabled}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Check-out Date</Form.Label>
                                    <DatePicker
                                        selected={checkOutDate}
                                        onChange={(date) => setCheckOutDate(date)}
                                        selectsEnd
                                        startDate={checkInDate}
                                        endDate={checkOutDate}
                                        minDate={checkInDate || todayForMinDate}
                                        dateFormat="yyyy-MM-dd"
                                        className="form-control"
                                        placeholderText="Select check-out"
                                        required
                                        filterDate={isDateDisabled}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Number of Guests</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={numGuests}
                                        onChange={(e) => setNumGuests(Number(e.target.value))}
                                        min="1"
                                        max={listing.maxGuests}
                                        required
                                    />
                                </Form.Group>
                                <p className="mb-3">Total Price: <strong>${calculateTotalPrice()}</strong></p>
                                <Button variant="success" type="submit" className="w-100" disabled={bookingLoading}>
                                    {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>

                    {listing.images && listing.images.length > 1 && (
                        <Card className="mt-4 shadow-sm">
                            <Card.Body>
                                <Card.Title className="mb-3">More Photos</Card.Title>
                                <Row xs={2} className="g-2">
                                    {listing.images.filter(img => img.trim() !== '').map((img, index) => (
                                        <Col key={index}>
                                            <Image
                                                src={`${process.env.REACT_APP_API_BASE_URL.replace('/api/v1', '')}${img}`}
                                                fluid rounded
                                                style={{ height: '100px', objectFit: 'cover', width: '100%' }}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
            <ConfirmationModal
                show={showModal}
                handleClose={() => { setShowModal(false); navigate('/user/bookings'); }}
                message={modalMessage}
                title="Booking Confirmation"
            />
        </Container>
    );
};

export default ListingDetailPage;