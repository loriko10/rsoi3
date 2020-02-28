import React from 'react';

import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

import './comments.css';
import PropTypes from "prop-types";

export default class Comments extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            data: [],
            validation: '',
            isLoading: false,
            isLoaded: false
        };


        this.deleteItem = this.deleteItem.bind(this);
    }

    get(name) {
        const value = "; " + document.cookie;
        const parts = value.split("; " + name + "=");

        if (parts.length === 2) {
            return parts.pop().split(";").shift();
        }
    }

    componentDidMount() {
        fetch(this.props.url,  {
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

    deleteItem(itemId, uid) {
        return () => {
            this.setState({
                isLoading: true
            });

            fetch('http://localhost:8000/api/comment/delete',  {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: uid,
                    cid: itemId
                })
            })
            .then(resp => {
                console.log(resp);
                if (resp.status === 200) {
                    this.setState({
                        isLoading: false,
                        validation: ''
                    });
                    // eslint-disable-next-line no-restricted-globals
                    location.href = '/home';
                } else {
                    resp.json().then(error => (error.message)).then(validation => {
                        this.setState({
                            isLoading: false,
                            validation
                        });

                        this.props.onError(validation);
                    });

                }
            });
        };
    }


    renderRow(titles, item) {
        const row = titles.map(title => (
            <td>{item[title] || ''}</td>
        ));
        const uid = String(this.get('uid'));
        if (String(item.uid) === uid) {
            row.push( <td>
                <Button
                    variant="dark"
                    type="button"
                    disabled={this.state.isLoading}
                    onClick={!this.state.isLoading ? this.deleteItem(item.id, uid) : null}>
                    {this.state.isLoading ? 'deleting...' : 'delete'}
                </Button>
            </td>)
        }

        return row;
    }

    render() {
        const titles = this.props.table || [];
        const {
            isLoaded,
            data
        } = this.state;
        console.log(data);

        return (
            <div className='comments-page'>
                {isLoaded && data.length && (
                    <Table striped bordered hover variant="dark">
                        <thead>
                        <tr>
                            {titles.map(title => (
                                <th>{title}</th>
                            ))}
                        </tr>
                        </thead>
                        {isLoaded &&
                        <tbody>
                        {data.map(item => (
                            <tr>
                                {this.renderRow(titles, item)}
                            </tr>
                        ))}
                        </tbody>}
                    </Table>
                )}
            </div>
        );
    }
}

Comments.propTypes = {
    onError: PropTypes.func,
    url: PropTypes.string,
    table: PropTypes.array
};
