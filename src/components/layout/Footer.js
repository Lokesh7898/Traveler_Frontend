import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="bg-dark text-white py-3 mt-auto">
            <Container>
                <Row>
                    <Col className="text-center">
                        <p className="mb-0">&copy; {currentYear} Traveler App. All rights reserved.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;