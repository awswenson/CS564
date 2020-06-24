import React, { Component } from 'react';

export class Profile extends Component {
    static displayName = Profile.name;

    constructor(props) {
        super(props);
        this.state = { loading: true };
    }

    componentDidMount() {
        // TODO
    }

    render() {
        return (
            <div>
                {this.renderLogin()}
                <br />
                {this.renderCreateAccount()}
            </div>
        );
    }

    renderLogin() {
        return (
            <div>
                <h1 id="tabelLabel">Login</h1>
                <form class="form-content">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="username">Username</label>
                                <input id="username" type="text" class="form-control" placeholder="Username" />
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input id="password" type="password" class="form-control" placeholder="Password" />
                            </div>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Login</button>
                </form>
            </div>
        );
    }

    renderCreateAccount() {
        return (
            <div>
                <h1 id="tabelLabel">Create Account</h1>
                <form class="form-content">
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
                                <input id="username" type="text" class="form-control" placeholder="Username" />
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input id="password" type="password" class="form-control" placeholder="Password" />
                            </div>
                            <div class="form-group">
                                <label for="confirmPassword">Confirm Password</label>
                                <input id="confirmPassword" type="password" class="form-control" placeholder="Confirm Password" />
                            </div>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
        );
    }
}
