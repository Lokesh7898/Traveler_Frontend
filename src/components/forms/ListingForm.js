import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, Badge, InputGroup } from 'react-bootstrap';
import Alert from '../common/Alert';
import LoadingSpinner from '../common/LoadingSpinner';

const ListingForm = ({ onSubmit, initialData = {}, loading, error, isEditMode = false }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');
    const [maxGuests, setMaxGuests] = useState('');
    const [tourType, setTourType] = useState('other');
    const [amenities, setAmenities] = useState([]);
    const [newAmenity, setNewAmenity] = useState('');
    const [images, setImages] = useState([]);
    const [existingImageUrls, setExistingImageUrls] = useState([]);

    useEffect(() => {
        if (initialData && isEditMode) {
            setTitle(initialData.title || '');
            setDescription(initialData.description || '');
            setLocation(initialData.location || '');
            setPrice(initialData.price || '');
            setMaxGuests(initialData.maxGuests || '');
            setTourType(initialData.tourType || 'other');
            setAmenities(initialData.amenities || []);
            setExistingImageUrls(initialData.images || []);

        }
    }, [initialData, isEditMode]);

    const handleAddAmenity = () => {
        if (newAmenity.trim() !== '' && !amenities.includes(newAmenity.trim())) {
            setAmenities([...amenities, newAmenity.trim()]);
            setNewAmenity('');
        }
    };

    const handleRemoveAmenity = (amenityToRemove) => {
        setAmenities(amenities.filter(amenity => amenity !== amenityToRemove));
    };

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    const handleRemoveExistingImage = (indexToRemove) => {
        setExistingImageUrls(existingImageUrls.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('location', location);
        formData.append('price', price);
        formData.append('maxGuests', maxGuests);
        formData.append('tourType', tourType);

        amenities.forEach(amenity => formData.append('amenities[]', amenity));

        images.forEach((image) => formData.append('images', image));

        if (isEditMode) {
            existingImageUrls.forEach(url => formData.append('existingImages[]', url));
        }

        onSubmit(formData);
    };

    const tourTypes = ['adventure', 'cultural', 'beach', 'city', 'nature', 'luxury', 'other'];

    return (
        <Card className="shadow p-4 mb-4">
            <Card.Title className="text-center mb-4">{isEditMode ? 'Edit Listing' : 'Add New Listing'}</Card.Title>
            {error && <Alert type="danger" message={error} dismissible />}
            {loading && <LoadingSpinner />}

            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </Form.Group>

                    <Form.Group as={Col} controlId="location">
                        <Form.Label>Location</Form.Label>
                        <Form.Control type="text" placeholder="Enter location" value={location} onChange={(e) => setLocation(e.target.value)} required />
                    </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </Form.Group>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="price">
                        <Form.Label>Price per night ($)</Form.Label>
                        <Form.Control type="number" placeholder="Enter price" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" />
                    </Form.Group>

                    <Form.Group as={Col} controlId="maxGuests">
                        <Form.Label>Max Guests</Form.Label>
                        <Form.Control type="number" placeholder="Enter max guests" value={maxGuests} onChange={(e) => setMaxGuests(e.target.value)} required min="1" />
                    </Form.Group>

                    <Form.Group as={Col} controlId="tourType">
                        <Form.Label>Tour Type</Form.Label>
                        <Form.Select value={tourType} onChange={(e) => setTourType(e.target.value)}>
                            {tourTypes.map(type => (
                                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="amenities">
                    <Form.Label>Amenities</Form.Label>
                    <InputGroup className="mb-2">
                        <Form.Control
                            type="text"
                            placeholder="Add amenity (e.g., WiFi, Pool)"
                            value={newAmenity}
                            onChange={(e) => setNewAmenity(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddAmenity();
                                }
                            }}
                        />
                        <Button variant="outline-secondary" onClick={handleAddAmenity}>
                            <i className="bi bi-plus"></i> Add
                        </Button>
                    </InputGroup>
                    <div className="d-flex flex-wrap gap-2">
                        {amenities.map((amenity, index) => (
                            <Badge key={index} bg="primary" className="p-2 d-flex align-items-center">
                                {amenity}
                                <Button
                                    variant="link"
                                    className="text-white p-0 ms-2"
                                    onClick={() => handleRemoveAmenity(amenity)}
                                    style={{ lineHeight: '1' }}
                                >
                                    <i className="bi bi-x-lg"></i>
                                </Button>
                            </Badge>
                        ))}
                    </div>
                </Form.Group>

                <Form.Group controlId="images" className="mb-3">
                    <Form.Label>Listing Images</Form.Label>
                    {existingImageUrls.length > 0 && (
                        <div className="mb-2">
                            <h6>Existing Images:</h6>
                            <Row xs={1} md={3} lg={4} className="g-2">
                                {existingImageUrls.map((imgUrl, index) => (
                                    <Col key={index}>
                                        <div className="position-relative">
                                            <img
                                                src={`${process.env.REACT_APP_API_BASE_URL.replace('/api/v1', '')}${imgUrl}`}
                                                alt={`Listing ${index}`}
                                                className="img-thumbnail"
                                                style={{ height: '100px', objectFit: 'cover', width: '100%' }}
                                            />
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                className="position-absolute top-0 end-0 rounded-circle p-0 d-flex justify-content-center align-items-center"
                                                style={{ width: '20px', height: '20px', fontSize: '0.75rem' }}
                                                onClick={() => handleRemoveExistingImage(index)}
                                            >
                                                <i className="bi bi-x"></i>
                                            </Button>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    )}
                    <Form.Control type="file" multiple onChange={handleImageChange} accept="image/*" />
                    <Form.Text className="text-muted">Upload up to 5 images. New uploads will replace existing ones (in edit mode, for simplicity).</Form.Text>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-3 d-flex align-items-center justify-content-center" disabled={loading}>
                    {isEditMode ? (loading ? 'Updating...' : <><i className="bi bi-save me-2"></i> Update Listing</>) : (loading ? 'Adding...' : <><i className="bi bi-plus-lg me-2"></i> Add Listing</>)}
                </Button>
            </Form>
        </Card>
    );
};

export default ListingForm;