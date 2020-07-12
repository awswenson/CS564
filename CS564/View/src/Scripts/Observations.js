﻿import React, { Component } from 'react';
import { Redirect } from "react-router-dom";

export class Observations extends Component 
{
    static displayName = Observations.name;

    constructor(props) 
    {
        super(props);
        this.state = { observations: [], noObservations: false, loading: true, id: -1, date: '', latitude: '', longitude: '', animal: '', comments: '', errorMessage: '', updateObservation: false, isLoggedIn: true };

        this.onKeyUpFilter = this.onKeyUpFilter.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeAnimal = this.onChangeAnimal.bind(this);
        this.onChangeLatitude = this.onChangeLatitude.bind(this);
        this.onChangeLongitude = this.onChangeLongitude.bind(this);
        this.onChangeComments = this.onChangeComments.bind(this);
        this.onAddObservationClicked = this.onAddObservationClicked.bind(this);
        this.onUpdateObservationClicked = this.onUpdateObservationClicked.bind(this);
        this.onCancelUpdateClicked = this.onCancelUpdateClicked.bind(this);
    }

    componentDidMount() 
    {
        this.popuplateObservations();
    }

    render()
    {
        return this.state.isLoggedIn ? this.renderMain() : this.renderRedirect();
    }

    renderRedirect()
    {
        return (
            <Redirect to={{ pathname: "/login", state: { referrer: this.props.location } }} />
        );
    }

    renderMain() 
    {
        return (
            <div>
                <h1>Observations</h1>
                {this.renderError()}
                {this.renderAddObservation()}
                {this.renderNoResultsBanner()}
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
                        <button class="btn btn-success float-right" style={{ display: this.state.updateObservation ? 'none' : '' }} onClick={this.onAddObservationClicked}>Add Observation</button>
                        <button class="btn btn-danger float-right" style={{ display: this.state.updateObservation ? '' : 'none' }} onClick={this.onCancelUpdateClicked}>Cancel</button>
                        <button class="btn btn-warning float-right mr-1" style={{ display: this.state.updateObservation ? '' : 'none' }} onClick={this.onUpdateObservationClicked}>Update Observation</button>
                    </div>
                </div>
            </form>
        );
    }

    renderObservations() 
    {
        if (this.state.observations.length > 0)
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
                                <tr key={observation.observationID}>
                                    <td>{this.convertDate(observation.observationDate)}</td>
                                    <td>{observation.observationLatitude}</td>
                                    <td>{observation.observationLongitude}</td>
                                    <td>{observation.animal}</td>
                                    <td>{observation.comments}</td>
                                    <td>
                                        <button type="button" class="btn btn-warning mr-1" onClick={this.onEditClicked.bind(this, observation)}>Edit</button>
                                        <button type="button" class="btn btn-danger" onClick={this.onDeleteClicked.bind(this, observation.observationID)}>Delete</button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            );
        }
    }

    renderNoResultsBanner() 
    {
        return this.state.noObservations ? <div class="alert alert-info mt-4" role="alert">You have no recorded observations. Use the form above to add your first observation!</div> : null;
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

        if (this.validateObservation())
        {
            this.add();
        }
    }

    onUpdateObservationClicked(event)
    {
        event.preventDefault(); // Prevent the page from refreshing

        if (this.validateObservation())
        {
            this.update();
        }
    }

    onCancelUpdateClicked(event)
    {
        event.preventDefault(); // Prevent the page from refreshing

        this.setState({
            id: -1,
            date: '',
            latitude: '',
            longitude: '',
            animal: '',
            comments: '',
            errorMessage: '',
            updateObservation: false
        });
    }

    onKeyUpFilter(event) 
    {
        const filter = event?.target?.value?.toUpperCase() || ""; // Contains the value in the trend field
        const rows = this.observationsTable?.getElementsByTagName("tr");

        if (!rows)
        {
            return; // No rows to filter
        }

        // Loop through all table rows and hide those who don't match the trend query
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

    onEditClicked(observation, event) 
    {
        if (!observation)
        {
            return;
        }

        const date = new Date(observation.observationDate);
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);

        this.setState({
            id: observation.observationID,
            date: date.getFullYear() + "-" + (month) + "-" + (day),
            latitude: observation.latitude,
            longitude: observation.longitude,
            animal: observation.animal,
            comments: observation.comments,
            errorMessage: '',
            updateObservation: true,
        });
    }

    onDeleteClicked(id, event) 
    {
        this.delete(id);
    }

    async add()
    {
        const observation = {
            observationID: this.state.id,
            observationDate: this.state.date,
            ObservationLatitude: this.state.latitude,
            observationIDLongitude: this.state.longitude,
            animal: this.state.animal,
            comments: this.state.comments,
        };

        const headers = new Headers();
        headers.set('Authorization', 'Bearer ' + localStorage.getItem("token"));

        const response = await fetch('observation', {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(observation)
        });

        if (response.ok)
        {
            observation.observationID = await response.text();

            this.state.observations.push(observation);

            this.setState({
                observations: this.state.observations,
                noObservations: this.state.observations.length == 0,
                id: -1,
                date: '',
                latitude: '',
                longitude: '',
                animal: '',
                comments: '',
                errorMessage: '',
                updateObservation: false
            });
        }
        else
        {
            if (response.status === 401) // Unauthorized
            {
                localStorage.setItem("token", "");
                this.setState({ isLoggedIn: false });
            }
            else
            {
                this.setState({ errorMessage: "Unable to add observation. Please try again." });
            }
        }
    }

    async update()
    {
        const observation = {
            id: this.state.id,
            observationDate: this.state.date,
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            animal: this.state.animal,
            comments: this.state.comments,
        };

        const headers = new Headers();
        headers.set('Authorization', 'Bearer ' + localStorage.getItem("token"));

        const response = await fetch('observation/' + this.state.id, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(observation)
        });

        if (response.ok)
        {
            const index = this.state.observations.findIndex(observation => observation.id === this.state.id);

            if (index !== -1)
            {
                this.state.observations[index] = observation;
            }
            else
            {
                this.state.observations.push(observation);
            }

            this.setState({
                observations: this.state.observations,
                noObservations: this.state.observations.length == 0,
                id: -1,
                date: '',
                latitude: '',
                longitude: '',
                animal: '',
                comments: '',
                errorMessage: '',
                updateObservation: false
            });
        }
        else
        {
            if (response.status === 401) // Unauthorized
            {
                localStorage.setItem("token", "");
                this.setState({ isLoggedIn: false });
            }
            else
            {
                this.setState({ errorMessage: "Unable to update observation. Please try again." });
            }
        }
    }

    async delete(id) 
    {
        const headers = new Headers();
        headers.set('Authorization', 'Bearer ' + localStorage.getItem("token"));

        const response = await fetch('observation/' + id, {
            method: 'DELETE',
            headers: headers
        });

        if (response.ok)
        {
            const data = this.state.observations.filter(observation => observation.observationID !== id);
            this.setState({ observations: data, noObservations: data.length == 0 });
        }
        else
        {
            if (response.status === 401) // Unauthorized
            {
                localStorage.setItem("token", "");
                this.setState({ isLoggedIn: false });
            }
            else
            {
                this.setState({ errorMessage: "Unable to delete observation. Please try again." });
            }
        }
    }

    validateObservation()
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
        if (!dateTime) 
        {
            return "";
        }

        const date = new Date(dateTime);

        return date ? date.toLocaleDateString() : "";
    }

    async popuplateObservations() 
    {
        const headers = new Headers();
        headers.set('Authorization', 'Bearer ' + localStorage.getItem("token"));

        const response = await fetch('observation', {
            method: 'GET',
            headers: headers
        });

        if (response.ok)
        {
            const data = await response.json();
            this.setState({ observations: data, noObservations: data.length == 0 });
        }
        else
        {
            if (response.status === 401) // Unauthorized
            {
                localStorage.setItem("token", "");
                this.setState({ isLoggedIn: false });
            }
            else 
            {
                this.setState({ observations: [], noObservations: false, errorMessage: "Unable to get observations." });
            }
        }
    }
}
