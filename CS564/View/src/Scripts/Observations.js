﻿import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import AsyncSelect from 'react-select/async';

export class Observations extends Component 
{
    static displayName = Observations.name;

    constructor(props) 
    {
        super(props);

        this.state = {
            observations: [],
            noObservations: false,
            updateObservation: false,
            id: 0,
            date: '',
            taxonID: '',
            animalOption: '',
            locationID: '',
            locationOption: '',
            comments: '',
            errorMessage: '',
            isLoggedIn: true
        };

        this.onKeyUpFilter = this.onKeyUpFilter.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeAnimal = this.onChangeAnimal.bind(this);
        this.onChangeComments = this.onChangeComments.bind(this);
        this.onChangeLocation = this.onChangeLocation.bind(this);
        this.onAddObservationClicked = this.onAddObservationClicked.bind(this);
        this.onUpdateObservationClicked = this.onUpdateObservationClicked.bind(this);
        this.onCancelUpdateClicked = this.onCancelUpdateClicked.bind(this);
        this.getLocationOptions = this.getLocationOptions.bind(this);
        this.getAnimalOptions = this.getAnimalOptions.bind(this);
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
                    <div class="form-group col-md-8">
                        <label for="location">Location</label>
                        <AsyncSelect id="location" cacheOptions defaultOptions placeholder="Location" noOptionsMessage={() => null} loadOptions={this.getLocationOptions} value={this.state.locationOption} onChange={this.onChangeLocation} />
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label for="animal">Animal</label>
                        <AsyncSelect id="animal" cacheOptions defaultOptions placeholder="Animal" noOptionsMessage={() => null} loadOptions={this.getAnimalOptions} value={this.state.animalOption} onChange={this.onChangeAnimal} />
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
                                <th>Location</th>
                                <th>Animal</th>
                                <th>Comments</th>
                                <th style={{ minWidth: "160px" }}>Modify</th>
                            </tr>
                        </thead>
                        <tbody ref={ref => this.observationsTable = ref}>
                            {this.state.observations.map(observation =>
                                <tr key={observation.observationID}>
                                    <td>{this.convertDate(observation.observationDate)}</td>
                                    <td>{observation.location.county}, {observation.location.state}</td>
                                    <td>{observation.animal.commonName} ({observation.animal.scientificName})</td>
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

    /**
     * Function tied to the locations search field that calls the web server to load the locations that match
     * the given search criteria
     * 
     * @param inputValue Search value
     * @param callback The function to call with the locations that match the given search criteria
     */
    async getLocationOptions(inputValue, callback)
    {
        if (!inputValue)
        {
            return callback([]);
        }

        const response = await fetch('locations/' + inputValue, {
            method: 'GET',
        });

        if (response.ok)
        {
            const locations = await response.json();

            return callback(locations.map(location => ({
                value: location.locationID,
                label: location.county + ', ' + location.state
            })));
        }
        else
        {
            callback([]);
        }
    }

    /**
     * Function tied to the animals search field that calls the web server to load the animals that match
     * the given search criteria
     *
     * @param inputValue Search value
     * @param callback The function to call with the animals that match the given search criteria
     */
    async getAnimalOptions(inputValue, callback)
    {
        if (!inputValue || inputValue.length < 2) // Improve performance by only performing searches if the user enters more than 1 character
        {
            return callback([]);
        }

        const response = await fetch('animals/' + inputValue, {
            method: 'GET',
        });

        if (response.ok)
        {
            const animals = await response.json();

            return callback(animals.map(animal => ({
                value: animal.taxonID,
                label: animal.commonName + ' (' + animal.scientificName + ')'
            })));
        }
        else
        {
            callback([]);
        }
    }

    onChangeDate(event) 
    {
        this.setState({ date: event?.target?.value });
    }

    onChangeAnimal(animal) 
    {
        this.setState({ animalOption: animal, taxonID: animal?.value });
    }

    onChangeComments(event) 
    {
        this.setState({ comments: event?.target?.value });
    }

    onChangeLocation(location)
    {
        this.setState({ locationOption: location, locationID: location?.value });
    }

    /**
     * Event handler for when the "Add Observations" button is clicked
     * 
     * @param event Event arguments
     */
    onAddObservationClicked(event)
    {
        event.preventDefault(); // Prevent the page from refreshing

        if (this.validateObservation())
        {
            this.add();
        }
    }

    /**
     * Event handler for when the "Update Observations" button is clicked
     *
     * @param event Event arguments
     */
    onUpdateObservationClicked(event)
    {
        event.preventDefault(); // Prevent the page from refreshing

        if (this.validateObservation())
        {
            this.update();
        }
    }

    /**
     * Event handler for when the "Cancel" button is clicked
     *
     * @param event Event arguments
     */
    onCancelUpdateClicked(event)
    {
        event.preventDefault(); // Prevent the page from refreshing

        this.clearObservationState();
    }

    /**
     * Event handler for when the "Edit" button is clicked
     *
     * @param event Event arguments
     */
    onEditClicked(observation, event) 
    {
        if (!observation)
        {
            return;
        }

        this.setObservationState(observation);

        this.setState({ errorMessage: '' });
    }

    /**
     * Event handler for when the "Delete" button is clicked
     *
     * @param event Event arguments
     */
    onDeleteClicked(id, event) 
    {
        this.delete(id);
    }

    /**
     * Event handler for when the end user attempts to filter the results 
     *
     * @param event Event arguments
     */
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

    convertDate(dateTime) 
    {
        if (!dateTime) 
        {
            return "";
        }

        const date = new Date(dateTime);

        return date ? date.toLocaleDateString() : "";
    }

    /**
     * Calls the web server to add an observation to the database
     */
    async add()
    {
        let observation = {
            observationID: 0,
            observationDate: !this.state.date ? new Date() : this.state.date,
            taxonID: this.state.taxonID,
            locationID: this.state.locationID,
            comments: this.state.comments,
        };

        const headers = new Headers();
        headers.set('Authorization', 'Bearer ' + localStorage.getItem("token"));

        const response = await fetch('observations', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(observation)
        });

        if (response.ok)
        {
            observation = await response.json();
            this.state.observations.push(observation);

            this.clearObservationState();

            this.setState({
                observations: this.state.observations,
                noObservations: this.state.observations.length == 0,
                errorMessage: '',
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
                const errorMessage = await response.text();
                this.setState({ errorMessage: "Unable to add observation. " + errorMessage });
            }
        }
    }

    /**
     * Calls the web server to update an observation in the database
     */
    async update()
    {
        let observation = {
            observationID: this.state.id,
            observationDate: !this.state.date ? new Date() : this.state.date,
            taxonID: this.state.taxonID,
            locationID: this.state.locationID,
            comments: this.state.comments,
        };

        const headers = new Headers();
        headers.set('Authorization', 'Bearer ' + localStorage.getItem("token"));

        const response = await fetch('observations/' + this.state.id, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(observation)
        });

        if (response.ok)
        {
            observation = await response.json();
            const index = this.state.observations.findIndex(observation => observation.observationID === this.state.id);

            if (index !== -1)
            {
                this.state.observations[index] = observation;
            }
            else
            {
                this.state.observations.push(observation);
            }

            this.clearObservationState();

            this.setState({
                observations: this.state.observations,
                noObservations: this.state.observations.length == 0,
                errorMessage: ''
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
                const errorMessage = await response.text();
                this.setState({ errorMessage: "Unable to update observation. " + errorMessage });
            }
        }
    }

    /**
     * Calls the web server to delete an observation in the database
     */
    async delete(id) 
    {
        const headers = new Headers();
        headers.set('Authorization', 'Bearer ' + localStorage.getItem("token"));

        const response = await fetch('observations/' + id, {
            method: 'DELETE',
            headers: headers
        });

        if (response.ok)
        {
            const data = this.state.observations.filter(observation => observation.observationID !== id);

            this.setState({
                observations: data,
                noObservations: data.length == 0,
                errorMessage: ''
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
                this.setState({ errorMessage: "Unable to delete observation. Please try again." });
            }
        }
    }

    /**
     * Validates the observation data input by the end user. This should be called before attempting to add
     * or update an observation
     */
    validateObservation()
    {
        if (!this.state.taxonID)
        {
            this.setState({ errorMessage: "Please specify the animal being observed!" });
            return false;
        }

        if (!this.state.locationID)
        {
            this.setState({ errorMessage: "Please specify the location of the observation!" });
            return false;
        }

        this.setState({ errorMessage: "" });

        return true;
    }

    /**
     * Calls the web server to get the end user's observations for display
     */
    async popuplateObservations() 
    {
        const headers = new Headers();
        headers.set('Authorization', 'Bearer ' + localStorage.getItem("token"));

        const response = await fetch('observations', {
            method: 'GET',
            headers: headers
        });

        if (response.ok)
        {
            const data = await response.json();

            this.setState({
                observations: data,
                noObservations: data.length == 0,
                errorMessage: ''
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
                this.setState({
                    observations: [],
                    noObservations: false,
                    errorMessage: "Unable to get observations."
                });
            }
        }
    }

    /**
     * Sets the state object of the component with an observation. This is typically called when we're attempting to
     * edit an observation as it will update the observation form with the currently selected observation
     * 
     * @param observation The observation object
     */
    setObservationState(observation)
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
            animalOption: { label: observation.animal?.commonName + ' (' + observation.animal?.scientificName + ')', value: observation.animal?.taxonID },
            taxonID: observation.taxonID,
            locationOption: { label: observation.location?.county + ', ' + observation.location?.state, value: observation.location?.locationID },
            locationID: observation.locationID,
            comments: observation.comments,
            updateObservation: true
        });
    }

    /**
     * Clears the observation from the state object of the component. This is typically called when after the end user
     * adds and observation, edits an observation, or cancels editing an observation
     */
    clearObservationState()
    {
        this.setState({
            id: 0,
            date: '',
            animalOption: '',
            taxonID: '',
            locationOption: '',
            locationID: '',
            comments: '',
            updateObservation: false,
        });
    }
}
