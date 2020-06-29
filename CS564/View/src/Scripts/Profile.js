import React, { Component } from 'react';

export class Profile extends Component {
    static displayName = Profile.name;

    constructor(props) {
        super(props);
        this.state = { loading: true };

        this.onLoginClicked.bind(this);
        this.onSubmitClicked.bind(this);
    }

    componentDidMount() {
        // TODO
    }

    render() {
        return (
            <p>Profile</p>
        );
    }
}
