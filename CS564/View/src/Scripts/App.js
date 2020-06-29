import React, { Component, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Home } from './Home';
import { Layout } from './Layout';
import { Search } from './Search';
import { Observations } from './Observations';
import { Trips } from './Trips';
import { Profile } from './Profile';
import { Login } from './Login';
import { CreateAccount } from './CreateAccount';
import PrivateRoute from '../Context/PrivateRoute';
import { AuthenticationContext } from '../Context/Authentication';

import '../Styles/App.css'

export default class App extends Component {
    static displayName = App.name;

    constructor(props)
    {
        super(props);
        this.state = { loading: true, token: JSON.parse(localStorage.getItem("token")) };

        this.setToken = this.setToken.bind(this);
    }

    render() {
        return (
            <AuthenticationContext.Provider value={{ token: this.state.token, setToken: this.setToken }}> 
                <Router>
                    <Layout>
                        <Route exact path='/' component={Home} />
                        <Route path='/search' component={Search} />
                        <PrivateRoute path='/observations' component={Observations} />
                        <PrivateRoute path='/trips' component={Trips} />
                        <PrivateRoute path='/profile' component={Profile} />
                        <Route path='/login' component={Login} />
                        <Route path='/create' component={CreateAccount} />
                    </Layout>
                </Router>
            </AuthenticationContext.Provider>
        );
    }

    setToken(token) {
        localStorage.setItem("token", JSON.stringify(token)); // Update local storage
        this.setState({ token: token }); // Update the application state
    }
}
