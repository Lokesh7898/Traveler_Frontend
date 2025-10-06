import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import userService from '../../services/userService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import defaultUserImage from '../../assets/images/user-placeholder.jpg';
import AppLayout from '../../components/layout/AppLayout';

const UserProfilePage = () => {
    const { user, loading: authLoading, setUser } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [photo, setPhoto] = useState(null);
    const [currentPhotoUrl, setCurrentPhotoUrl] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState(null);
    const [updateSuccess, setUpdateSuccess] = useState(null);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setCurrentPhotoUrl(user.photo ? `${process.env.REACT_APP_API_BASE_URL.replace('/api/v1', '')}${user.photo}` : defaultUserImage);
        }
    }, [user]);

    const handlePhotoChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        setUpdateError(null);
        setUpdateSuccess(null);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        if (photo) {
            formData.append('photo', photo);
        }

        try {
            const axiosResponse = await userService.updateMe(formData);
            const apiResponseData = axiosResponse.data;
            setUser(apiResponseData.data.user);
            setUpdateSuccess('Profile updated successfully!');
            if (apiResponseData.data.user.photo) {
                setCurrentPhotoUrl(`${process.env.REACT_APP_API_BASE_URL.replace('/api/v1', '')}${apiResponseData.data.user.photo}`);
            }
            setPhoto(null);
        } catch (err) {
            console.error("Error in handleSubmit (UserProfilePage):", err);
            setUpdateError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setUpdateLoading(false);
        }
    };

    if (authLoading || !user) {
        return <LoadingSpinner />;
    }

    return (
        <AppLayout isAdmin={false}>
            <h1 className="mb-4">My Profile</h1>
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow p-4">
                        <Card.Title className="text-center mb-4">Edit Profile</Card.Title>
                        {updateError && <Alert type="danger" message={updateError} dismissible onClose={() => setUpdateError(null)} />}
                        {updateSuccess && <Alert type="success" message={updateSuccess} dismissible onClose={() => setUpdateSuccess(null)} />}

                        <Form onSubmit={handleSubmit}>
                            <div className="text-center mb-4">
                                <Image
                                    src={currentPhotoUrl}
                                    roundedCircle
                                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                    className="border border-secondary"
                                    alt="Profile"
                                />
                            </div>

                            <Form.Group className="mb-3" controlId="profilePhoto">
                                <Form.Label>Change Profile Photo</Form.Label>
                                <Form.Control type="file" onChange={handlePhotoChange} accept="image/*" />
                                <Form.Text className="text-muted">Max file size 10MB.</Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100 mt-3 d-flex align-items-center justify-content-center" disabled={updateLoading}>
                                {updateLoading ? 'Updating...' : <><i className="bi bi-save me-2"></i> Update Profile</>}
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </AppLayout>
    );
};

export default UserProfilePage;