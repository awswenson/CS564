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
        let contents = this.state.loading ? <div class="row"><div class="col-auto">Loading</div></div> : this.renderTripTable(this.state.trips);

        return (
            <div>
                <h1>Trips</h1>
                <input class="form-control mb-4" type="text" placeholder="Search Trips" onKeyUp={this.search} />
                {contents}
            </div>
        );
    }

    renderTripTable(trips) {
        return (
            <table class="table table-hover">
                <thead class="thead-dark">
                    <tr>
                        <th>Location</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Modify</th>
                    </tr>
                </thead>
                <tbody ref={ref => this.tripsTable = ref}>
                    {trips.map(trip =>
                        <tr key={trip.id}>
                            <td>{trip.location}</td>
                            <td>{this.convertDate(trip.startDate)}</td>
                            <td>{this.convertDate(trip.endDate)}</td>
                            <td>
                                <button type="button" class="btn btn-warning mr-1" onClick={this.edit.bind(this, trip.id)}>Edit</button>
                                <button type="button" class="btn btn-danger" onClick={this.delete.bind(this, trip.id)}>Delete</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
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
        const filter = event?.target?.value?.toUpperCase() || ""; // Contains the value in the search field
        const rows = this.tripsTable?.getElementsByTagName("tr");

        if (!rows)
        {
            return; // No rows to filter
        }

        // Loop through all table rows and hide those who don't match the search query
        for (let i = 0; i < rows.length; i++)
        {
            const data = rows[i].textContent || rows[i].innerText;

            if (data.toUpperCase().indexOf(filter) > -1)
            {
                rows[i].style.display = "";
            }
            else
            {
                rows[i].style.display = "none";
            }
        }
    }

    edit(key, event) {
        alert("Edit button was pressed with key " + key);
        // TODO
    }

    delete(key, event) {
        alert("Delete button was pressed with key " + key);
        // TODO
    }

    async popuplateTrips() {
        const response = await fetch('trips');
        const data = await response.json();
        this.setState({ trips: data, loading: false });
    }
}
