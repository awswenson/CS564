import React, { Component } from 'react';
import { Redirect } from "react-router-dom";

export class Profile extends Component 
{
    static displayName = Profile.name;

    constructor(props) 
    {
        super(props);
        this.state = { loading: true, profile: [], isLoggedIn: true };

        this.onLogoutClicked = this.onLogoutClicked.bind(this);
    }

    componentDidMount() 
    {
        this.loadUser();
    }

    render() 
    {
        return this.state.isLoggedIn ? this.renderMain() : this.renderRedirect();
    }

    renderRedirect()
    {
        return (
            <Redirect to="/login" />
        );
    }

    renderMain()
    {
        return (
            <div>
                <h1>Profile</h1>
                {this.renderProfile()}
                <button class="btn btn-primary mr-2" onClick={this.onLogoutClicked}>Logout</button>
            </div>
        );
    }

    renderProfile()
    {
        if (this.state.loading)
        {
            return (
                <div class="row">
                    <div class="col-auto">Loading</div>
                </div>
            );
        }
        else
        {
            return (
                <form class="form-content">
                    <div class="form-row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="firstName">First Name</label>
                                <input id="firstName" type="text" class="form-control" value={this.state.profile.firstName} readOnly />
                            </div>
                            <div class="form-group">
                                <label for="lastName">Last Name</label>
                                <input id="lastName" type="text" class="form-control" value={this.state.profile.lastName} readOnly />
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="email">Email Address</label>
                                <input id="email" type="email" class="form-control" value={this.state.profile.email} readOnly />
                            </div>
                            <div class="form-group">
                                <label for="username">Username</label>
                                <input id="username" type="text" class="form-control" value={this.state.profile.id} readOnly />
                            </div>
                        </div>
                    </div>
                </form>
            );
        }
    }

    async loadUser()
    {
        const response = await fetch('profile', { method: 'GET' });
        const data = await response.json();
        this.setState({ profile: data, loading: false });
    }

    onLogoutClicked(event)
    {
        localStorage.setItem("token", "");
        this.setState({ isLoggedIn: false });
    }
}
