import React from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import './register.css';

export default class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            password: '',
            mail: '',
            validation: '',
            isLoading: false
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
    }

    onChangeValue(name) {
        return event => {
            const value = event.target.value;
            this.setState({
                [name]: value,
                validation: ''
            });
        }
    }

    onSubmit() {
        const {
            name,
            password,
            mail
        } = this.state;

        if (!name || !password || !mail) {
            this.setState({
                validation: 'Login, password or mail is empty!'
            })
        } else {
            this.setState({
                isLoading: true
            });

            fetch('http://localhost:8000/api/register',  {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    password,
                    mail
                })
            })
                .then(resp => {
                    if (resp.status === 201) {
                        // eslint-disable-next-line no-restricted-globals
                        location.href = '/home';
                    } else {
                        console.log(resp);
                        resp.json().then(error => (error.message)).then(validation => {
                            this.setState({
                                isLoading: false,
                                validation
                            })
                        });
                    }
                });
        }
    }

    render() {
        const {
            validation,
            name,
            password,
            isLoading,
            mail
        } = this.state;

        return (
            <div className='register-page'>
                <div className='register-form'>
                    <Form noValidate>
                        <Form.Group controlId="formBasicName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Enter usernane"
                                value={name}
                                onChange={this.onChangeValue('name')}/>
                        </Form.Group>
                        <Form.Group controlId="formBasicMail">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                required
                                type="mail"
                                placeholder="email"
                                onChange={this.onChangeValue('mail')}
                                value={mail}/>
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                required
                                type="password"
                                placeholder="Password"
                                onChange={this.onChangeValue('password')}
                                value={password}/>
                        </Form.Group>
                        <Button
                            variant="dark"
                            type="button"
                            disabled={isLoading}
                            onClick={!isLoading ? this.onSubmit : null}>
                            {isLoading ? 'Loading...' : 'Submit'}
                        </Button>
                        {validation && (
                            <Form.Text className="register-error">
                                {validation}
                            </Form.Text>
                        )}
                    </Form>
                </div>
            </div>
        );
    }
}
