import React, { Component } from 'react';

export class Observations extends Component {
    static displayName = Observations.name;

    constructor(props) {
        super(props);
        this.state = { loading: true };
    }

    render() {
        return (
            <div>
                <h1 id="tabelLabel">Observations</h1>
            </div>
        );
    }
}
