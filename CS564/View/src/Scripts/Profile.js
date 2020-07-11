import React, { Component } from 'react';
import { Redirect } from "react-router-dom";

export class Profile extends Component 
{
    static displayName = Profile.name;

    constructor(props) 
    {
        super(props);
        this.state = { profile: [], isLoggedIn: true };

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
            <Redirect to={{ pathname: "/login", state: { referrer: this.props.location } }} />
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
        return (
            <form class="form-content">
                <div class="form-row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="firstName">First Name</label>
                            <input id="firstName" type="text" class="form-control" value={this.state.profile?.firstName} readOnly />
                        </div>
                        <div class="form-group">
                            <label for="lastName">Last Name</label>
                            <input id="lastName" type="text" class="form-control" value={this.state.profile?.lastName} readOnly />
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="email">Email Address</label>
                            <input id="email" type="email" class="form-control" value={this.state.profile?.email} readOnly />
                        </div>
                        <div class="form-group">
                            <label for="username">User ID</label>
                            <input id="username" type="number" class="form-control" value={this.state.profile?.userID} readOnly />
                        </div>
                    </div>
                </div>
            </form>
        );
    }

    async loadUser()
    {
        const headers = new Headers();
        headers.set('Authorization', 'Bearer ' + localStorage.getItem("token"));

        const response = await fetch('profile', {
            method: 'GET',
            headers: headers
        });

        if (response.ok)
        {
            const data = await response.json();
            this.setState({ profile: data });
        }
        else
        {
            localStorage.setItem("token", "");
            this.setState({ isLoggedIn: false });
        }
    }

    onLogoutClicked(event)
    {
        localStorage.setItem("token", "");
        this.setState({ isLoggedIn: false });
    }
}
