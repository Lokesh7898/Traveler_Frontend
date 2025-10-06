import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import Alert from '../common/Alert';

const RegisterForm = ({ onSubmit, error, loading }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        onSubmit({ name, email, password, role });
    };

    return (
        <Card className="shadow p-4">
            <Card.Title className="text-center mb-4">Register</Card.Title>
            <Form onSubmit={handleSubmit}>
                {error && <Alert type="danger" message={error} dismissible />}

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

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength="8"
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength="8"
                    />
                </Form.Group>

                <Form.Group className="mb-4" controlId="role">
                    <Form.Label>Register As</Form.Label>
                    <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="user">Traveler</option>
                        <option value="host">Host (to list properties)</option>
                    </Form.Select>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </Button>
            </Form>
        </Card>
    );
};

export default RegisterForm;