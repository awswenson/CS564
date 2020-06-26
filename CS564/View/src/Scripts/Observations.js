import React, { Component } from 'react';

export class Observations extends Component {
    static displayName = Observations.name;

    constructor(props) {
        super(props);
        this.state = { observations: [], loading: true };

        this.search = this.search.bind(this);
    }

    componentDidMount() {
        this.popuplateObservations();
    }

    render() {
        let contents = this.state.loading ? <div class="row"><div class="col-auto">Loading</div></div> : this.renderObservationsTable(this.state.observations);

        return (
            <div>
                <h1>Observations</h1>
                <input class="form-control mb-4" type="text" placeholder="Search Observations" onKeyUp={this.search} />
                {contents}
            </div>
        );
    }

    renderObservationsTable(observations) {
        return (
            <table class="table table-hover">
                <thead class="thead-dark">
                    <tr>
                        <th>Date</th>
                        <th>Longitude</th>
                        <th>Latitude</th>
                        <th>Animal</th>
                        <th>Comments</th>
                        <th>Modify</th>
                    </tr>
                </thead>
                <tbody ref={ref => this.observationsTable = ref}>
                    {observations.map(observation =>
                        <tr key={observation.id}>
                            <td>{this.convertDate(observation.observationDate)}</td>
                            <td>{observation.longitude}</td>
                            <td>{observation.latitude}</td>
                            <td>{observation.animal}</td>
                            <td>{observation.comments}</td>
                            <td>
                                <button type="button" class="btn btn-warning mr-1" onClick={this.onEditClicked.bind(this, observation.id)}>Edit</button>
                                <button type="button" class="btn btn-danger" onClick={this.onDeleteClicked.bind(this, observation.id)}>Delete</button>
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
        const rows = this.observationsTable?.getElementsByTagName("tr");

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

    onEditClicked(id, event) {
        alert("Edit button was pressed with id " + id);
        this.edit(id);
        // TODO
    }

    async edit(id) {

    }

    onDeleteClicked(id, event) {
        this.delete(id);
    }

    async delete(id) {
        const response = await fetch('observation/' + id, { method: 'DELETE' });
        const success = await response.json();

        if (success)
        {
            const data = this.state.observations.filter(observation => observation.id !== id);
            this.setState({ observations: data, loading: false });
        }
        else
        {
            // TODO
        }
    }

    async popuplateObservations() {
        const response = await fetch('observation');
        const data = await response.json();
        this.setState({ observations: data, loading: false });
    }
}
