import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Sidebar = ({ isAdmin = false }) => {
    return (
        <Nav className="col-md-2 d-none d-md-block bg-light sidebar p-0 shadow-sm min-vh-100">
            <div className="position-sticky pt-3">
                <Nav className="flex-column">
                    {isAdmin ? (
                        <>
                            <LinkContainer to="/admin">
                                <Nav.Link className="d-flex align-items-center">
                                    <i className="bi bi-speedometer2 me-2"></i>
                                    Dashboard
                                </Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/admin/listings">
                                <Nav.Link className="d-flex align-items-center">
                                    <i className="bi bi-house-door me-2"></i>
                                    Manage Listings
                                </Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/admin/listings/new">
                                <Nav.Link className="d-flex align-items-center">
                                    <i className="bi bi-plus-square me-2"></i>
                                    Add New Listing
                                </Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/admin/bookings">
                                <Nav.Link className="d-flex align-items-center">
                                    <i className="bi bi-calendar-check me-2"></i>
                                    Manage Bookings
                                </Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/admin/users">
                                <Nav.Link className="d-flex align-items-center">
                                    <i className="bi bi-people me-2"></i>
                                    Manage Users
                                </Nav.Link>
                            </LinkContainer>
                        </>
                    ) : (
                        <>
                            <LinkContainer to="/profile">
                                <Nav.Link className="d-flex align-items-center">
                                    <i className="bi bi-person me-2"></i>
                                    My Profile
                                </Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/user/bookings">
                                <Nav.Link className="d-flex align-items-center">
                                    <i className="bi bi-calendar-event me-2"></i>
                                    My Bookings
                                </Nav.Link>
                            </LinkContainer>
                        </>
                    )}
                </Nav>
            </div>
        </Nav>
    );
};

export default Sidebar;