import React, { Component } from 'react';
import { Link } from "react-router-dom";

export class CreateAccount extends Component 
{
    static displayName = CreateAccount.name;

    constructor(props) 
    {
        super(props);
        this.state = { loading: true, firstName: '', lastName: '', email: '', username: '', password: '', confirmPassword: '', errorMessage: '' };

        this.onSubmitClicked = this.onSubmitClicked.bind(this);
        this.createAccount = this.createAccount.bind(this);
        this.onChangeFirstName = this.onChangeFirstName.bind(this);
        this.onChangeLastName = this.onChangeLastName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
    }

    componentDidMount() 
    {

    }

    render() 
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
                            <label for="username">Username</label>
                            <input id="username" type="text" class="form-control" placeholder="Username" value={this.state.username} onChange={this.onChangeUsername} required />
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
                        <Link to="/login">Already have an account?</Link>
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

        if (!emailRegex.test(this.state.email.toLowerCase()))
        {
            this.setState({ errorMessage: "The format of the provided email is invalid!" });
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

    createAccount()
    {

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

    onChangeUsername(event) 
    {
        this.setState({ username: event?.target?.value });
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
