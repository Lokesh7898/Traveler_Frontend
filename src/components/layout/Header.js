import React from 'react';
import { Container } from 'react-bootstrap';

const Header = () => {
    return (
        <header className="bg-dark text-white py-3">
            <Container>
                <h1 className="text-center mb-0">Traveler App</h1>
            </Container>
        </header>
    );
};

export default Header;  