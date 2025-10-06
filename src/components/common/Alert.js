import React from 'react';
import { Alert as BootstrapAlert } from 'react-bootstrap';

const Alert = ({ message, type = 'info', onClose, dismissible = false }) => {
    if (!message) return null;

    return (
        <BootstrapAlert variant={type} onClose={onClose} dismissible={dismissible}>
            {message}
        </BootstrapAlert>
    );
};

export default Alert;