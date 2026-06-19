import { useState } from "react";
import { Alert, Button, Col, Form, Row, FormGroup } from "react-bootstrap";
import {useNavigate} from "react-router";
import PropTypes from 'prop-types';

function LoginForm({login}) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [showError, setshowError] = useState(false); //state for showing error messages in the form
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const credentials = {username, password};
        try {
            await login(credentials);
            navigate('/'); //homepage for now, change to /game once implemented
        } catch(err) {
            setErrorMessage(err.error || err.message || 'Login failed');
            setshowError(true); //shows alert error message 
        }
    };

    return(
        <Row className="mt-3 justify-content-md-center">
            <Col md={4}>
                <h1 className="pb-3">Login</h1>
                <Form onSubmit={handleSubmit}>
                    <Alert dismissible show={showError} onClose={() => setshowError(false)} variant="danger">{errorMessage}</Alert>
                    <Form.Group className="mb-3" controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type = "text"
                            value = {username}
                            placeholder = "Enter username"
                            onChange = {(ev) => setUsername(ev.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type = "password"
                            value = {password}
                            placeholder = "Enter password"
                            onChange = {(ev) => setPassword(ev.target.value)}
                            required
                            minLength={6}
                        />
                    </Form.Group>
                    <Button className="mt-3" type="submit">Login</Button>
                </Form>
            </Col>
        </Row>
    );
}

function LogoutButton({logout}) {
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logout();
        navigate('/'); //Homepage, only page visible to logged out users
    };
    return <Button variant ="outline-light" onClick={handleLogout}> Logout </Button>
}

function LoginButton() {
    const navigate = useNavigate();
    return <Button variant ="outline-light" onClick={() => navigate('/login')}> Login </Button>
}

LoginForm.propTypes = {
    login: PropTypes.func.isRequired
};

LogoutButton.propTypes = {
    logout: PropTypes.func.isRequired
};


export {LoginForm, LoginButton, LogoutButton};