import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import defaultListingImage from '../../assets/images/listing-placeholder.jpg';

const ListingCard = ({ listing }) => {
    const defaultImage = defaultListingImage;
    const validImages = listing.images && Array.isArray(listing.images)
        ? listing.images.filter(img => img && img.trim() !== '')
        : [];
    const imageUrl = validImages.length > 0
        ? `${process.env.REACT_APP_API_BASE_URL.replace('/api/v1', '')}${validImages[0]}`
        : defaultImage;

    return (
        <Card className="h-100 shadow-sm">
            <Card.Img
                variant="top"
                src={imageUrl}
                alt={listing.title}
                style={{ height: '200px', objectFit: 'cover' }}
            />
            <Card.Body className="d-flex flex-column">
                <Card.Title as="h5" className="text-truncate" title={listing.title}>
                    {listing.title}
                </Card.Title>
                <Card.Text className="text-muted mb-2">
                    <i className="bi bi-geo-alt-fill me-1"></i> {listing.location}
                </Card.Text>
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="text-warning">
                        {'★'.repeat(Math.floor(listing.ratingsAverage || 0))}
                        {'☆'.repeat(5 - Math.floor(listing.ratingsAverage || 0))} ({listing.ratingsQuantity || 0})
                    </small>
                    <small className="text-muted">Guests: {listing.maxGuests || 0}</small>
                </div>
                <Card.Text className="fw-bold fs-4 mt-auto">
                    ${listing.price || 0} <span className="fs-6 text-muted">/ night</span>
                </Card.Text>
                <Link to={`/listings/${listing._id}`} className="mt-2">
                    <Button variant="outline-primary" className="w-100">View Details</Button>
                </Link>
            </Card.Body>
        </Card>
    );
};

export default ListingCard;