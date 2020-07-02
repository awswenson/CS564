import React, { Component } from 'react';

export class Profile extends Component {
    static displayName = Profile.name;

    constructor(props) {
        super(props);
        this.state = { loading: true };

        this.onLogoutClicked = this.onLogoutClicked.bind(this);
    }

    componentDidMount() {
        // TODO
    }

    render() {
        return (
            <div>
                <p>Profile</p>
                <button class="btn btn-primary mr-2" onClick={this.onLogoutClicked}>Logout</button>
            </div>
        );
    }

    onLogoutClicked(event)
    {
        localStorage.setItem("token", "");
        window.location.reload();
    }
}
