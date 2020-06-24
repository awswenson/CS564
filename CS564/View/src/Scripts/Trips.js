import React, { Component } from 'react';

export class Trips extends Component {
    static displayName = Trips.name;

    constructor(props) {
        super(props);
        this.state = { trips: [], loading: true };

        this.search = this.search.bind(this);
        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
        this.convertDate = this.convertDate.bind(this);
    }

    componentDidMount() {
        this.popuplateTrips();
    }

    render() {
        let contents = this.state.loading ? <p><em>Loading...</em></p> : this.renderTripTable(this.state.trips);

        return (
            <div>
                <h1 id="tabelLabel" >Trips</h1>
                {contents}
            </div>
        );
    }

    renderTripTable(trips) {
        return (
            <div>
               <input class="form-control mb-4" id="tripSearch" type="text" placeholder="Search Trips" onKeyUp={this.search} />
                <table className='table table-striped' aria-labelledby="tabelLabel">
                    <thead>
                        <tr>
                            <th>Location</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Modify</th>
                        </tr>
                    </thead>
                    <tbody id="trips">
                        {trips.map(trip =>
                            <tr key={trip.id}>
                                <td>{trip.location}</td>
                                <td>{this.convertDate(trip.startDate)}</td>
                                <td>{this.convertDate(trip.endDate)}</td>
                                <td class="text-nowrap"><button type="button" class="btn btn-warning mr-1" onClick={this.edit}>Edit</button><button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button></td>
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

    async popuplateTrips() {
        const response = await fetch('trips');
        const data = await response.json();
        this.setState({ trips: data, loading: false });
    }
}
