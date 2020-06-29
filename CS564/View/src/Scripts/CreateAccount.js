import React, { Component } from 'react';
import { Link } from "react-router-dom";

export class CreateAccount extends Component {
    static displayName = CreateAccount.name;

    constructor(props) {
        super(props);
        this.state = { loading: true, username: '', password: '' };

        this.onSubmitClicked = this.onSubmitClicked.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
    }

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <h1>Create Account</h1>
                <form class="form-content" onSubmit={this.onSubmitClicked}>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="firstName">First Name</label>
                                <input id="firstName" type="text" class="form-control" placeholder="First Name" />
                            </div>
                            <div class="form-group">
                                <label for="lastName">Last Name</label>
                                <input id="lastName" type="text" class="form-control" placeholder="Last Name" />
                            </div>
                            <div class="form-group">
                                <label for="email">Email Address</label>
                                <input id="email" type="email" class="form-control" placeholder="Email Address" />
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="username">Username</label>
                                <input id="username" type="text" class="form-control" placeholder="Username" value={this.state.username} onChange={this.onChangeUsername} />
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input id="password" type="password" class="form-control" placeholder="Password" value={this.state.password} onChange={this.onChangePassword} />
                            </div>
                            <div class="form-group">
                                <label for="confirmPassword">Confirm Password</label>
                                <input id="confirmPassword" type="password" class="form-control" placeholder="Confirm Password" />
                            </div>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary mr-2">Submit</button>
                    <Link to="/login">Already have an account?</Link>
                </form>
            </div>
        );
    }

    onSubmitClicked(event) {

    }

    onChangeUsername(event) {
        this.setState({ username: event?.target?.value });
    }

    onChangePassword(event) {
        this.setState({ password: event?.target?.value });
    }
}
