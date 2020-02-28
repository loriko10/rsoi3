import React from 'react';

import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './question.css';
import PropTypes from "prop-types";

export default class Question extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: '',

            data: [],
            validation: '',
            isLoading: false,
            isLoaded: false
        };


        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
    }

    get(name) {
        const value = "; " + document.cookie;
        const parts = value.split("; " + name + "=");

        if (parts.length === 2) {
            return parts.pop().split(";").shift();
        }
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
           text
        } = this.state;

        if (!text) {
            this.setState({
                validation: 'some data is empty!'
            })
        } else {
            this.setState({
                isLoading: true
            });

            fetch('http://localhost:8000/api/comment/create',  {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text,
                    qid: this.props.qid,
                    id: this.get('uid')
                })
            })
                .then(resp => {
                    if (resp.status === 201) {
                        resp.json().then(body => {
                            window.location.href = '/question/'+this.props.qid;
                        });

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

    componentDidMount() {
        fetch('http://localhost:8000/api/question/'+this.props.qid,  {
            method: 'GET'
        })
            .then(resp => {
                if (resp.status === 200) {
                    console.log(resp);
                    resp.json().then(data => {
                        this.setState({
                            isLoading: false,
                            isLoaded: true,
                            data
                        })
                    });
                } else {
                    console.log(resp);
                    resp.json().then(error => (error.message)).then(validation => {
                        this.setState({
                            isLoading: false,
                            isLoaded: false,
                            validation
                        });
                        this.props.onError(validation);
                    });
                }
            });
    }

    render() {
        const {
            isLoaded,
            data,
            text,
            validation,
            isLoading
        } = this.state;

        return (
            <div className='comments-page'>
                {isLoaded && (
                    <div className='content'>
                        <Card>
                            <Card.Body>
                                <Card.Title>{data.question[0].title}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{`id: ${data.question[0].id}, uid: ${data.question[0].uid}`}</Card.Subtitle>
                                <Card.Text>
                                   {data.question[0].text}
                                </Card.Text>
                                <Card.Link href="#">{data.question[0].tag}</Card.Link>
                            </Card.Body>
                        </Card>
                        <div className="comments-block">
                            {
                                data.comments.map(comment => (
                                    <Card>
                                        <Card.Body>
                                            <Card.Subtitle className="mb-2 text-muted">{`id: ${comment.id}, uid: ${comment.uid}, qid: ${comment.qid}`}</Card.Subtitle>
                                            <Card.Text>
                                                {comment.text}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                ))
                            }
                            <Card className='form-comments'>
                                <Card.Body>
                                    <Card.Text>
                                        <Form noValidate>
                                            <Form.Group controlId="formBasicEmail">
                                                <Form.Label>New Comment</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    placeholder="enter your comment"
                                                    value={text}
                                                    onChange={this.onChangeValue('text')}/>
                                            </Form.Group>
                                            <Button
                                                className='login-button'
                                                variant="dark"
                                                type="button"
                                                disabled={isLoading}
                                                onClick={!isLoading ? this.onSubmit : null}>
                                                {isLoading ? 'submiting...' : 'Submit'}
                                            </Button>
                                            {validation && (
                                                <Form.Text className="login-error">
                                                    {validation}
                                                </Form.Text>
                                            )}
                                        </Form>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                )}

            </div>
        );
    }
}

Question.propTypes = {
    onError: PropTypes.func,
    qid: PropTypes.string
};
