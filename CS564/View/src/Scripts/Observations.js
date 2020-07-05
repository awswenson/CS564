import React, { Component } from 'react';

export class Observations extends Component 
{
    static displayName = Observations.name;

    constructor(props) 
    {
        super(props);
        this.state = { observations: [], loading: true, date: '', latitude: '', longitude: '', animal: '', comments: '', errorMessage: '' };

        this.onKeyUpFilter = this.onKeyUpFilter.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeAnimal = this.onChangeAnimal.bind(this);
        this.onChangeLatitude = this.onChangeLatitude.bind(this);
        this.onChangeLongitude = this.onChangeLongitude.bind(this);
        this.onChangeComments = this.onChangeComments.bind(this);
        this.onAddObservationClicked = this.onAddObservationClicked.bind(this);
    }

    componentDidMount() 
    {
        this.popuplateObservations();
    }

    render() 
    {
        return (
            <div>
                <h1>Observations</h1>
                {this.renderError()}
                {this.renderAddObservation()}
                {this.renderObservations()}
            </div>
        );
    }

    renderError() 
    {
        return this.state.errorMessage ? <div class="alert alert-danger" role="alert">{this.state.errorMessage}</div> : null;
    }

    renderAddObservation()
    {
        return (
            <form class="form-content">
                <div class="form-row">
                    <div class="form-group col-md-4">
                        <label for="date">Date</label>
                        <input id="date" type="date" class="form-control" placeholder="Date" value={this.state.date} onChange={this.onChangeDate} />
                    </div>
                    <div class="form-group col-md-4">
                        <label for="latitute">Latitute</label>
                        <input id="latitute" type="text" class="form-control" placeholder="Latitude" value={this.state.latitude} onChange={this.onChangeLatitude} required />
                    </div>
                    <div class="form-group col-md-4">
                        <label for="longitute">Longitude</label>
                        <input id="longitute" type="text" class="form-control" placeholder="Longitude" value={this.state.longitude} onChange={this.onChangeLongitude} required />
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label for="animal">Animal</label>
                        <input id="animal" type="text" class="form-control" placeholder="Animal" value={this.state.animal} onChange={this.onChangeAnimal} required />
                    </div>
                    <div class="form-group col-md-6">
                        <label for="comments">Comments</label>
                        <input id="comments" type="text" class="form-control" placeholder="Comments" value={this.state.comments} onChange={this.onChangeComments} />
                    </div>
                </div>
                <div class="form-row">
                    <div class="col">
                        <button class="btn btn-primary float-right" onClick={this.onAddObservationClicked}>Add Observation</button>
                    </div>
                </div>
            </form>
        );
    }

    renderObservations() 
    {
        if (this.state.loading)
        {
            return (
                <div class="row">
                    <div class="col-auto">Loading</div>
                </div>
            );
        }
        else
        {
            return (
                <div>
                    <input class="form-control mb-4 mt-4" type="text" placeholder="Filter Observations" onKeyUp={this.onKeyUpFilter} />
                    <table class="table table-hover sortable">
                        <thead class="thead-dark">
                            <tr>
                                <th>Date</th>
                                <th>Latitude</th>
                                <th>Longitude</th>
                                <th>Animal</th>
                                <th>Comments</th>
                                <th>Modify</th>
                            </tr>
                        </thead>
                        <tbody ref={ref => this.observationsTable = ref}>
                            {this.state.observations.map(observation =>
                                <tr key={observation.id}>
                                    <td>{this.convertDate(observation.observationDate)}</td>
                                    <td>{observation.latitude}</td>
                                    <td>{observation.longitude}</td>
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
                </div>
            );
        }
    }

    onChangeDate(event) 
    {
        this.setState({ date: event?.target?.value });
    }

    onChangeAnimal(event) 
    {
        this.setState({ animal: event?.target?.value });
    }

    onChangeLatitude(event) 
    {
        this.setState({ latitude: event?.target?.value });
    }

    onChangeLongitude(event) 
    {
        this.setState({ longitude: event?.target?.value });
    }

    onChangeComments(event) 
    {
        this.setState({ comments: event?.target?.value });
    }

    onAddObservationClicked(event)
    {
        event.preventDefault(); // Prevent the page from refreshing

        if (this.validateAddObservation())
        {
            this.add();
        }
    }

    async add()
    {
        const observation = {
            id: '-1',
            observationDate: this.state.date,
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            animal: this.state.animal,
            comments: this.state.comments,
        };

        const response = await fetch('observation', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(observation)
        });

        if (response.ok)
        {
            observation.id = await response.text();

            const data = this.state.observations.concat(observation);
            this.setState({ observations: data, date: '', latitude: '', longitude: '', animal: '', comments: '', errorMessage: '' });
        }
        else
        {
            // TODO
        }
    }

    validateAddObservation()
    {
        if (!this.state.date)
        {
            this.setState({ errorMessage: "Missing required inputs!" });
            return false;
        }

        this.setState({ errorMessage: "" });
        return true;
    }

    convertDate(dateTime) 
    {
        if (!dateTime) {
            return "";
        }

        const date = new Date(Date.parse(dateTime));

        return date ? date.toLocaleDateString() : "";
    }

    onKeyUpFilter(event) 
    {
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

    onEditClicked(id, event) 
    {
        alert("Edit button was pressed with id " + id);
        this.edit(id);
        // TODO
    }

    async edit(id) 
    {

    }

    onDeleteClicked(id, event) 
    {
        this.delete(id);
    }

    async delete(id) 
    {
        const response = await fetch('observation/' + id, { method: 'DELETE' });

        if (response.ok)
        {
            const data = this.state.observations.filter(observation => observation.id !== id);
            this.setState({ observations: data, loading: false });
        }
        else
        {
            // TODO
        }
    }

    async popuplateObservations() 
    {
        const response = await fetch('observation', { method: 'GET' });
        const data = await response.json();
        this.setState({ observations: data, loading: false });
    }
}
