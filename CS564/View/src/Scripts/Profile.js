import React, { Component } from 'react';

export class Profile extends Component {
    static displayName = Profile.name;

    constructor(props) {
        super(props);
        this.state = { loading: true };
    }

    render() {
        return (
            <div>
                <h1 id="tabelLabel">Profile</h1>
            </div>
        );
    }
}
