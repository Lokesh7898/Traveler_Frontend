import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import Alert from '../common/Alert';

const LoginForm = ({ onSubmit, error, loading }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ email, password });
    };

    return (
        <Card className="shadow p-4">
            <Card.Title className="text-center mb-4">Login</Card.Title>
            <Form onSubmit={handleSubmit}>
                {error && <Alert type="danger" message={error} dismissible />}

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

                <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                    {loading ? 'Logging In...' : 'Login'}
                </Button>
            </Form>
        </Card>
    );
};

export default LoginForm;