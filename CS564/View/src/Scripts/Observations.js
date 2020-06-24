import React, { Component } from 'react';

export class Observations extends Component {
    static displayName = Observations.name;

    constructor(props) {
        super(props);
        this.state = { observations: [], loading: true };

        this.search = this.search.bind(this);
        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        this.popuplateObservations();
    }

    render() {
        let contents = this.state.loading ? <p><em>Loading...</em></p> : this.renderObservationsTable(this.state.observations);

        return (
            <div>
                <h1 id="tabelLabel" >Observations</h1>
                {contents}
            </div>
        );
    }

    renderObservationsTable(observations) {
        return (
            <div>
                <input class="form-control mb-4" id="tripSearch" type="text" placeholder="Search Observations" onKeyUp={this.search} />
                <table className='table table-striped' aria-labelledby="tabelLabel">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Longitude</th>
                            <th>Latitude</th>
                            <th>Animal</th>
                            <th>Comments</th>
                            <th>Modify</th>
                        </tr>
                    </thead>
                    <tbody id="observations">
                        {observations.map(observation =>
                            <tr key={observation.id}>
                                <td>{this.convertDate(observation.observationDate)}</td>
                                <td>{observation.longitude}</td>
                                <td>{observation.latitude}</td>
                                <td>{observation.animal}</td>
                                <td>{observation.comments}</td>
                                <td><button type="button" class="btn btn-warning mr-1" onClick={this.edit}>Edit</button><button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button></td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }

    convertDate(dateTime) {
        if (!dateTime) {
            return "";
        }

        const date = new Date(Date.parse(dateTime));

        return date ? date.toLocaleDateString() : "";
    }

    search(event) {
        // TODO
    }

    edit(event) {
        alert("Edit button was pressed");
        // TODO
    }

    delete(event) {
        alert("Delete button was pressed");
        // TODO
    }

    async popuplateObservations() {
        const response = await fetch('observation');
        const data = await response.json();
        this.setState({ observations: data, loading: false });
    }
}
