import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <Container className="my-5 text-center">
            <Row className="justify-content-center">
                <Col md={8}>
                    <h1 className="display-1 fw-bold text-danger">404</h1>
                    <h2 className="mb-3">Page Not Found</h2>
                    <p className="lead mb-4">
                        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>
                    <Link to="/">
                        <Button variant="primary" size="lg">Go to Homepage</Button>
                    </Link>
                </Col>
            </Row>
        </Container>
    );
};

export default NotFoundPage;