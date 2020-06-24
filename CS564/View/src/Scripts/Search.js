import React, { Component } from 'react';

export class Search extends Component {
    static displayName = Search.name;

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
                <h1 id="tabelLabel">Search</h1>
            </div>
        );
    }
}
