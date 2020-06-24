import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './Layout';
import { Home } from './Home';
import { Search } from './Search';
import { Observations } from './Observations';
import { Trips } from './Trips';
import { Profile } from './Profile';


import '../Styles/App.css'

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <Layout>
                <Route exact path='/' component={Home} />
                <Route path='/search' component={Search} />
                <Route path='/observations' component={Observations} />
                <Route path='/trips' component={Trips} />
                <Route path='/profile' component={Profile} />
            </Layout>
        );
    }
}
