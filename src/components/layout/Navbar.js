import React, { useContext } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import Alert from '../common/Alert';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [logoutError, setLogoutError] = React.useState(null);

    const handleLogout = async () => {
        try {
            await authService.logout();
            logout();
            navigate('/login');
            setLogoutError(null);
        } catch (err) {
            setLogoutError(err.message || 'Logout failed.');
            console.error('Logout error:', err);
        }
    };

    return (
        <BootstrapNavbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
            <Container>
                <LinkContainer to="/">
                    <BootstrapNavbar.Brand>Traveler App</BootstrapNavbar.Brand>
                </LinkContainer>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BootstrapNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {user && (
                            <LinkContainer to="/listings">
                                <Nav.Link>Listings</Nav.Link>
                            </LinkContainer>
                        )}
                        {user && user.role !== 'admin' && (
                            <LinkContainer to="/user/bookings">
                                <Nav.Link>My Bookings</Nav.Link>
                            </LinkContainer>
                        )}
                        {user && user.role === 'admin' && (
                            <LinkContainer to="/admin/listings">
                                <Nav.Link>Admin Listings</Nav.Link>
                            </LinkContainer>
                        )}
                    </Nav>
                    <Nav>
                        {logoutError && <Alert type="danger" message={logoutError} dismissible onClose={() => setLogoutError(null)} />}
                        {user ? (
                            <NavDropdown
                                title={
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-person-circle me-1"></i>
                                        Welcome, {user.name}
                                    </div>
                                }
                                id="username-dropdown"
                                align="end"
                            >
                                <LinkContainer to="/profile">
                                    <NavDropdown.Item>
                                        <i className="bi bi-person me-2"></i> My Profile
                                    </NavDropdown.Item>
                                </LinkContainer>

                                {user.role === 'admin' && (
                                    <LinkContainer to="/admin">
                                        <NavDropdown.Item>
                                            <i className="bi bi-speedometer2 me-2"></i> Admin Dashboard
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                )}
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>
                                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            null
                        )}
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar;