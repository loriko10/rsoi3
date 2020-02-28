import React from 'react';
import PropTypes from "prop-types";

export default class Delete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            validation: '',
            isLoading: false,
            isLoaded: false
        };
    }

    remove(name) {
        const date = new Date();

        date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));

        document.cookie = name+"=; expires="+date.toUTCString()+"; path=/";
    }

    componentDidMount() {
        fetch(this.props.url,  {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.props.uid
            })
        })
            .then(resp => {
                if (resp.status === 200) {
                    this.remove('uid');
                    window.location.href = '/home';
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
        return (
           <div>
           </div>
        );
    }
}

Delete.propTypes = {
    uid: PropTypes.string,
    url: PropTypes.string
};

