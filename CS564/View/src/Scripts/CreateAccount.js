import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";

export class CreateAccount extends Component 
{
    static displayName = CreateAccount.name;

    constructor(props) 
    {
        super(props);
        this.state = { isLoggedIn: !!localStorage.getItem("token"), firstName: '', lastName: '', email: '', userID: '', password: '', confirmPassword: '', errorMessage: '' };

        this.onSubmitClicked = this.onSubmitClicked.bind(this);
        this.createAccount = this.createAccount.bind(this);
        this.onChangeFirstName = this.onChangeFirstName.bind(this);
        this.onChangeLastName = this.onChangeLastName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangeUserID = this.onChangeUserID.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
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
                <h1>Create Account</h1>
                {this.renderError()}
                {this.renderCreateAccount()}
            </div>
        );
    }

    renderError() 
    {
        return this.state.errorMessage ? <div class="alert alert-danger" role="alert">{this.state.errorMessage}</div> : null;
    }

    renderCreateAccount()
    {
        return (
            <form class="form-content">
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="firstName">First Name</label>
                            <input id="firstName" type="text" class="form-control" placeholder="First Name" value={this.state.firstName} onChange={this.onChangeFirstName} required />
                        </div>
                        <div class="form-group">
                            <label for="lastName">Last Name</label>
                            <input id="lastName" type="text" class="form-control" placeholder="Last Name" value={this.state.lastName} onChange={this.onChangeLastName} required />
                        </div>
                        <div class="form-group">
                            <label for="email">Email Address</label>
                            <input id="email" type="email" class="form-control" placeholder="Email Address" value={this.state.email} onChange={this.onChangeEmail} required />
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="userID">User ID</label>
                            <input id="userID" type="number" min="1" class="form-control" placeholder="Username" value={this.state.userID} onChange={this.onChangeUserID} required />
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input id="password" type="password" class="form-control" placeholder="Password" value={this.state.password} onChange={this.onChangePassword} required />
                        </div>
                        <div class="form-group">
                            <label for="confirmPassword">Confirm Password</label>
                            <input id="confirmPassword" type="password" class="form-control" placeholder="Confirm Password" value={this.state.confirmPassword} onChange={this.onChangeConfirmPassword} required />
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="col">
                        <button class="btn btn-primary mr-2" onClick={this.onSubmitClicked}>Submit</button>
                        <Link to={{ pathname: "/login", state: { referrer: this.props?.location?.state?.referrer } }}>Already have an account?</Link>
                    </div>
                </div>
            </form>
        );
    }

    onSubmitClicked(event) 
    {
        event.preventDefault(); // Prevent the page from refreshing

        if (this.validateInput())
        {
            this.createAccount();
        }
    }

    validateInput()
    {
        const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

        if (!this.state.email)
        {
            this.setState({ errorMessage: "An email address is required! Please provide an email address." });
            return false;
        }

        if (!emailRegex.test(this.state.email.toLowerCase()))
        {
            this.setState({ errorMessage: "The format of the provided email is invalid!" });
            return false;
        }

        if (!this.state.firstName || !this.state.lastName)
        {
            this.setState({ errorMessage: "The provided name is invalid! Make sure to specify both a first and last name." });
            return false;
        }

        if (this.state.userID <= 0)
        {
            this.setState({ errorMessage: "The provided user ID is invalid! Please provide a positive user ID." });
            return false;
        }

        if (!this.state.password)
        {
            this.setState({ errorMessage: "Please specify a password!" });
            return false;
        }

        if (this.state.password != this.state.confirmPassword)
        {
            this.setState({ errorMessage: "The provided passwords do not match!" });
            return false;
        }

        this.setState({ errorMessage: "" });
        return true;
    }

    async createAccount()
    {
        const user = {
            id: '',
            password: '',
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
        };

        const headers = new Headers();
        headers.set('Authorization', 'Basic ' + btoa(this.state.userID + ":" + this.state.password));

        const response = await fetch('create', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(user)
        });

        if (response.ok) // Account created successfull 
        {
            const token = await response.text();

            localStorage.setItem("token", token); // Update local storage

            this.setState({ isLoggedIn: true, errorMessage: '' });
        }
        else 
        {
            const errorMessage = await response.text();
            this.setState({ isLoggedIn: false, errorMessage: "Unable to create account. " + errorMessage });
        }
    }

    onChangeFirstName(event)
    {
        this.setState({ firstName: event?.target?.value });
    }

    onChangeLastName(event)
    {
        this.setState({ lastName: event?.target?.value });
    }

    onChangeEmail(event)
    {
        this.setState({ email: event?.target?.value });
    }

    onChangeUserID(event) 
    {
        this.setState({ userID: event?.target?.value });
    }

    onChangePassword(event) 
    {
        this.setState({ password: event?.target?.value });
    }

    onChangeConfirmPassword(event)
    {
        this.setState({ confirmPassword: event?.target?.value });
    }
}
