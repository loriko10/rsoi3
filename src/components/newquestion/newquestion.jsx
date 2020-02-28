import React from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import './newquestion.css';

export default class Newquestion extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            text: '',
            tag: '',
            isLoading: false,

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

    get(name) {
        const value = "; " + document.cookie;
        const parts = value.split("; " + name + "=");

        if (parts.length === 2) {
            return parts.pop().split(";").shift();
        }
    }

    onSubmit() {
        const {
            title,
            text,
            tag
        } = this.state;

        if (!title || !text || !tag) {
            this.setState({
                validation: 'some data is empty!'
            })
        } else {
            this.setState({
                isLoading: true
            });

            fetch('http://localhost:8000/api/question/create',  {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    text,
                    tag,
                    id: this.get('uid')
                })
            })
            .then(resp => {
                if (resp.status === 201) {
                    resp.json().then(body => {
                        window.location.href = '/questions';
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

    render() {
        const {
            validation,
            title,
            text,
            tag,
            isLoading
        } = this.state;

        return (
           <div className='login-page'>
               <div className='login-form'>
                   <Form noValidate>
                       <Form.Group controlId="formBasicEmail">
                           <Form.Label>Title</Form.Label>
                           <Form.Control
                               required
                               type="text"
                               placeholder="Enter usernane"
                               value={title}
                               onChange={this.onChangeValue('title')}/>
                       </Form.Group>
                       <Form.Group controlId="formBasicPassword">
                           <Form.Label>Text</Form.Label>
                           <Form.Control
                               required
                               type="text"
                               placeholder="enter text"
                               onChange={this.onChangeValue('text')}
                               value={text}/>
                       </Form.Group>
                       <Form.Group controlId="formBasicPassword">
                           <Form.Label>Tag</Form.Label>
                           <Form.Control
                               required
                               type="text"
                               placeholder="enter tag"
                               onChange={this.onChangeValue('tag')}
                               value={tag}/>
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
               </div>
           </div>
        );
    }
}
