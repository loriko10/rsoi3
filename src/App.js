import React from 'react';
import { Router, Route } from 'react-router-dom';
import { history } from './history/history';

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Alert from 'react-bootstrap/Alert'

import Login from './components/login/login';
import Register from './components/register/register';
import Users from './components/users/users';
import Questions from './components/questions/questions';
import Question from './components/question/question';
import Delete from './components/delete/delete';
import Comments from './components/comments/comments';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Newquestion from "./components/newquestion/newquestion";


class App extends React.Component {
    constructor() {
        super();

        this.state = {
            errorMsg: ''
        };

        this.onError = this.onError.bind(this);
        this.closeError = this.closeError.bind(this);
    }

    onError(errorMsg) {
        if (errorMsg !== this.state.errorMsg) {
            this.setState({
                errorMsg
            })
        }
    }

    closeError() {
        this.setState({
            errorMsg: ''
        })
    }

    renderError() {
        const {
            errorMsg
        } = this.state;

        if (errorMsg) {
            return (
                <Alert variant="danger" onClose={this.closeError} dismissible>
                    <Alert.Heading>Oh, Something went wrong!</Alert.Heading>
                    <p>{errorMsg}</p>
                </Alert>
            );
        }
    }

    get(name) {
        const value = "; " + document.cookie;
        const parts = value.split("; " + name + "=");

        if (parts.length === 2) {
            return parts.pop().split(";").shift();
        }
    }

    remove(name) {
        const date = new Date();

        date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));

        document.cookie = name+"=; expires="+date.toUTCString()+"; path=/";
    }

    auth() {
        return Number.isFinite(Number(this.get('uid')));
    }

    getQuestionIdLink() {
        return `/user/${this.get('uid')}/questions`;
    }

    getCommentIdLink() {
        return `/user/${this.get('uid')}/comments`;
    }

    render() {
        return (
            <div className="App">
                {this.renderError()}
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="/home">LABA3</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="/home">Home</Nav.Link>
                        {!this.auth() && <Nav.Link href="/login">Login</Nav.Link>}
                        {!this.auth() && <Nav.Link href="/register">Register</Nav.Link>}
                        {<Nav.Link href="/questions">Questions</Nav.Link>}
                        {this.auth() && <Nav.Link href={this.getQuestionIdLink()}>MyQuestions</Nav.Link>}
                        {this.auth() && <Nav.Link href={this.getCommentIdLink()}>MyComments</Nav.Link>}
                        {this.auth() && <Nav.Link href={`/newquestion`}>NewQuestion</Nav.Link>}
                        {this.auth() && <Nav.Link href="/logout">Logout</Nav.Link>}
                        {this.auth() && <Nav.Link href={`/user/delete/${this.get('uid')}`}>Delete</Nav.Link>}
                    </Nav>
                </Navbar>
                <Router history={history}>
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <Route
                        exact
                        path="/home"
                        component={() => <Users onError={this.onError} />} />
                    <Route
                        exact
                        path="/logout"
                        render={() => {
                            this.remove('uid');
                            window.location="/home";
                        }} />
                    <Route
                        exact
                        path="/user/delete/:id"
                        render={(match) => {
                            return (<Delete onError={this.onError} url={`http://localhost:8000/api/user/delete/${match.match.params.id}`} uid={this.get('uid')}/>);
                        }} />
                    <Route
                        exact
                        path="/user/:id/questions/"
                        render={(match) => {
                            return (<Questions onError={this.onError} url={`http://localhost:8000/api/all/questions/user/${match.match.params.id}`} table={['id', 'title', 'text', 'tag', 'uid', 'date']}/>)
                        }} />
                    <Route
                        exact
                        path="/user/:id/comments/"
                        render={(match) => {
                            return (<Comments onError={this.onError} url={`http://localhost:8000/api/all/comments/user/${match.match.params.id}`} table={['id', 'uid', 'qid', 'text', 'date']}/>)
                        }} />
                    <Route
                        exact
                        path="/newquestion"
                        component={() => <Newquestion onError={this.onError} />} />

                    <Route
                        exact
                        path="/questions"
                        component={() => <Questions onError={this.onError} url="http://localhost:8000/api/all/questions" table={['id', 'title', 'text', 'tag', 'uid', 'date']}/>}/>

                    <Route
                        exact
                        path="/question/:qid"
                        render={(match) => {
                            return (<Question onError={this.onError} qid={match.match.params.qid}/>)
                        }} />
                </Router>
                <div className="footer-copyright text-center py-3" />
            </div>
        )

    }
}

export default App;
