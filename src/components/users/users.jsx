import React from 'react';

import Table from 'react-bootstrap/Table';
// import Button from 'react-bootstrap/Button';

import PropTypes from 'prop-types';

import './users.css';

export default class Users extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            validation: '',
            isLoading: false,
            isLoaded: false
        };

        // this.onDelete = this.onDelete.bind(this);
    }

    componentDidMount() {
        fetch('http://localhost:8000/api/all/users',  {
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

    // onDelete(username) {
    //     return () => {
    //
    //     };
    // }

    renderRow(titles, item) {
        return titles.map(title => {
            // if (title === 'delete') {
            //     return (
            //         <td>
            //             <Button
            //                 variant="dark"
            //                 type="button"
            //                 disabled={this.state.isLoading}
            //                 onClick={!this.state.isLoading ? this.onDelete(item['name']) : null}>
            //                 {this.state.isLoading ? 'deleting...' : 'delete'}
            //             </Button>
            //         </td>
            //     );
            // } else {
                return (<td>{item[title] || ''}</td>);
            // }
        })
    }

    render() {
        const titles = ['id', 'name', 'mail', 'password', 'createdAt']; //, 'delete'];
        const {
            isLoaded,
            data
        } = this.state;

        return (
            <div className='users-page'>
                <div className='users-page'>
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
                </div>
            </div>
        );
    }
}

Users.propTypes = {
    onError: PropTypes.func
};
