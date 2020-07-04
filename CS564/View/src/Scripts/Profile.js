import React, { Component } from 'react';

export class Profile extends Component {
    static displayName = Profile.name;

    constructor(props) {
        super(props);
        this.state = { loading: true, profile: [] };

        this.onLogoutClicked = this.onLogoutClicked.bind(this);
    }

    componentDidMount() {
        this.loadUser();
    }

    render() {
        let contents = this.state.loading ? <div class="row"><div class="col-auto">Loading</div></div> : this.renderProfile(this.state.profile);

        return (
            <div>
                <h1>Profile</h1>
                {contents}
                <button class="btn btn-primary mr-2" onClick={this.onLogoutClicked}>Logout</button>
            </div>
        );
    }

    renderProfile(profile)
    {
        return (
            <div class="col">
                <div>
                    <label for="username">Username:</label>
                    <span class="ml-2" id="username">{profile.id}</span>
                </div>
                <div>
                    <label for="email">Email:</label>
                    <span class="ml-2" id="email">{profile.email}</span>
                </div>
                <div>
                    <label for="email">Name:</label>
                    <span class="ml-2" id="email">{profile.firstName} {profile.lastName}</span>
                </div>
            </div>
        );
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
        window.location.reload();
    }
}
