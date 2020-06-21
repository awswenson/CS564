import React, { Component } from 'react';

export class Trips extends Component {
    static displayName = Trips.name;

    constructor(props) {
        super(props);
        this.state = { loading: true };
    }

    render() {
        return (
            <div>
                <h1 id="tabelLabel">Trips</h1>
            </div>
        );
    }
}
