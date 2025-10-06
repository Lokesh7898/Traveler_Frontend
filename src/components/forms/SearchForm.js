import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatISO } from 'date-fns';

const SearchForm = ({ onSearch }) => {
    const [location, setLocation] = useState('');
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [guests, setGuests] = useState(1);
    const [sort, setSort] = useState('price');

    const handleSubmit = (e) => {
        e.preventDefault();
        const searchParams = {};

        if (location) searchParams.location = location;
        if (guests > 0) searchParams.guests = guests;

        if (checkInDate) {
            searchParams.check_in = formatISO(checkInDate, { representation: 'date' });
        }
        if (checkOutDate) {
            searchParams.check_out = formatISO(checkOutDate, { representation: 'date' });
        }

        if (checkInDate && checkOutDate && checkInDate >= checkOutDate) {
            alert('Check-out date must be after check-in date.');
            return;
        }

        if (sort) searchParams.sort = sort;

        onSearch(searchParams);
    };

    return (
        <Form onSubmit={handleSubmit} className="p-3 bg-light rounded shadow-sm mb-4">
            <Row className="g-3 align-items-end">
                <Col md={4} sm={12}>
                    <Form.Group controlId="formLocation">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="e.g., Luxor Downtown"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col md={2} sm={6}>
                    <Form.Group controlId="formCheckIn">
                        <Form.Label>Check-in</Form.Label>
                        <DatePicker
                            selected={checkInDate}
                            onChange={(date) => setCheckInDate(date)}
                            selectsStart
                            startDate={checkInDate}
                            endDate={checkOutDate}
                            minDate={new Date()}
                            dateFormat="yyyy-MM-dd"
                            className="form-control"
                            placeholderText="Select date"
                            isClearable
                        />
                    </Form.Group>
                </Col>
                <Col md={2} sm={6}>
                    <Form.Group controlId="formCheckOut">
                        <Form.Label>Check-out</Form.Label>
                        <DatePicker
                            selected={checkOutDate}
                            onChange={(date) => setCheckOutDate(date)}
                            selectsEnd
                            startDate={checkInDate}
                            endDate={checkOutDate}
                            minDate={checkInDate || new Date()}
                            dateFormat="yyyy-MM-dd"
                            className="form-control"
                            placeholderText="Select date"
                            isClearable
                        />
                    </Form.Group>
                </Col>
                <Col md={2} sm={6}>
                    <Form.Group controlId="formGuests">
                        <Form.Label>Guests</Form.Label>
                        <Form.Control
                            type="number"
                            value={guests}
                            onChange={(e) => setGuests(Number(e.target.value))}
                            min="1"
                        />
                    </Form.Group>
                </Col>
                <Col md={2} sm={6}>
                    <Form.Group controlId="formSort">
                        <Form.Label>Sort By</Form.Label>
                        <Form.Select value={sort} onChange={(e) => setSort(e.target.value)}>
                            <option value="price">Price (Low to High)</option>
                            <option value="-price">Price (High to Low)</option>
                            <option value="-ratingsAverage">Rating (High to Low)</option>
                            <option value="-createdAt">Newest</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col xs={12} className="text-center">
                    <Button variant="primary" type="submit" className="w-auto px-5">
                        Search
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default SearchForm;