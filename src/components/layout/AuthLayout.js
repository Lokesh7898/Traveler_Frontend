import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, isLoginPage = true, appName = "Traveler App" }) => {
    return (
        <div className="auth-page-wrapper">
            <div className="position-absolute top-0 start-0 p-3 text-primary h4 fw-bold">
                {appName}
            </div>

            <div className="auth-card-container">
                <div className="auth-intro-section">
                    <h2 className="mb-3">
                        {isLoginPage ? 'Hello, Welcome!' : 'Welcome Back!'}
                    </h2>
                    <p className="mb-4">
                        {isLoginPage ? "Don't have an account?" : "Already have an account?"}
                    </p>
                    {isLoginPage ? (
                        <Link to="/register" className="btn btn-outline-light rounded-pill px-4">
                            Register
                        </Link>
                    ) : (
                        <Link to="/login" className="btn btn-outline-light rounded-pill px-4">
                            Login
                        </Link>
                    )}
                </div>

                <div className="auth-form-section">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;