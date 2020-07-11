import React, { Component, createContext } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { Home } from './Home';
import { Layout } from './Layout';
import { Search } from './Search';
import { Observations } from './Observations';
import { Profile } from './Profile';
import { Login } from './Login';
import { CreateAccount } from './CreateAccount';

import '../Styles/App.css'

export default class App extends Component {
    static displayName = App.name;

    constructor(props)
    {
        super(props);
        this.state = { loading: true, token: localStorage.getItem("token") };

        this.isLoggedIn = this.isLoggedIn.bind(this);
    }

    render()
    {
        const AuthenticationContext = createContext(this.state.token);

        return (
            <AuthenticationContext.Provider value={this.state.token}> 
                <Router>
                    <Layout>
                        <Route exact path='/' component={Home} />
                        <Route path='/search' component={Search} />
                        <Route path='/observations' render={props => this.isLoggedIn() ? <Observations {...props} /> : <Redirect to={{ pathname: '/login', state: { referrer: props.location } }} />} />
                        <Route path='/profile' render={props => this.isLoggedIn() ? <Profile {...props} /> : <Redirect to={{ pathname: '/login', state: { referrer: props.location } }} />} />
                        <Route path='/login' component={Login} />
                        <Route path='/create' component={CreateAccount} />
                    </Layout>
                </Router>
            </AuthenticationContext.Provider>
        );
    }

    isLoggedIn()
    {
        return !!localStorage.getItem("token");
    }
}
