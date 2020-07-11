import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";

export class Login extends Component 
{
    static displayName = Login.name;

    constructor(props) 
    {
        super(props);

        this.state = { isLoggedIn: !!localStorage.getItem("token"), isError: false, userID: '', password: '' };

        this.onLoginClicked = this.onLoginClicked.bind(this);
        this.onChangeUserID = this.onChangeUserID.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
    }

    componentDidMount() 
    {
        this.setState({ isLoggedIn: !!this.context?.token });
    }

    render() 
    {
        return this.state.isLoggedIn ? this.renderRedirect() : this.renderMain();
    }

    renderRedirect()
    {
        return (
            <Redirect to={this.props?.location?.state?.referrer || '/'} />
        );
    }

    renderMain()
    {
        return (
            <div>
                {this.renderError()}
                {this.renderLogin()}
            </div>
        );
    }

    renderError() 
    {
        return this.state.isError ? <div class="alert alert-danger" role="alert">The user ID or password provided were incorrect!</div> : null; 
    }

    renderLogin() 
    {
        return (
            <div>
                <h1>Login</h1>
                <form class="form-content">
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="userID">User ID</label>
                            <input id="userID" type="number" class="form-control" placeholder="User ID" value={this.state.userID} onChange={this.onChangeUserID} required />
                        </div>
                        <div class="form-group col-md-6">
                            <label for="password">Password</label>
                            <input id="password" type="password" class="form-control" placeholder="Password" value={this.state.password} onChange={this.onChangePassword} required />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <button class="btn btn-primary mr-2" onClick={this.onLoginClicked}>Login</button>
                            <Link to={{ pathname: "/create", state: { referrer: this.props?.location?.state?.referrer } }}>Don't have an account?</Link>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    onLoginClicked(event) 
    {
        event.preventDefault(); // Prevent the page from refreshing
        this.login();
    }

    onChangeUserID(event) 
    {
        this.setState({ userID: event?.target?.value });
    }

    onChangePassword(event) 
    {
        this.setState({ password: event?.target?.value });
    }

    async login()
    {
        if (!this.state.userID || !this.state.password)
        {
            return;
        }

        const headers = new Headers();
        headers.set('Authorization', 'Basic ' + btoa(this.state.userID + ":" + this.state.password));

        const response = await fetch('login', {
            method: 'POST',
            headers: headers,
        });

        if (response.ok) // Login successfull 
        {
            const token = await response.text();

            localStorage.setItem("token", token); // Update local storage

            this.setState({ isLoggedIn: true, isError: false }); 
        }
        else // Login unsuccessful
        {
            this.setState({ isLoggedIn: false, isError: true }); 
        }
    }
}
