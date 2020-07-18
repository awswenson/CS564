import React, { Component } from 'react';
import AsyncSelect from 'react-select/async';

export class Trend extends Component {
    static displayName = Trend.name;

    constructor(props)
    {
        super(props);
        this.state = { trendResults: [], date: '', locationOption: '', locationID: '', noResults: false };

        this.onKeyUpFilter = this.onKeyUpFilter.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeLocation = this.onChangeLocation.bind(this);
        this.onTrendClicked = this.onTrendClicked.bind(this);
        this.getLocationOptions = this.getLocationOptions.bind(this);
    }

    componentDidMount()
    {

    }

    render()
    {
        return (
            <div>
                <h1>Trending Near You</h1>
                {this.renderTrendCriteria()}
                {this.renderTrendResults()}
                {this.renderNoResultsBanner()}
            </div>
        );
    }

    renderTrendCriteria()
    {
        return (
            <form class="form-content">
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label for="date">Date</label>
                        <input id="date" type="date" class="form-control" placeholder="Date" value={this.state.date} onChange={this.onChangeDate} />
                    </div>
                    <div class="form-group col-md-6">
                        <label for="location">Location</label>
                        <AsyncSelect id="location" cacheOptions defaultOptions placeholder="Location" noOptionsMessage={() => null} loadOptions={this.getLocationOptions} value={this.state.locationOption} onChange={this.onChangeLocation} />
                    </div>
                </div>
                <div class="form-row">
                    <div class="col">
                        <button class="btn btn-primary float-right" onClick={this.onTrendClicked}>Search</button>
                    </div>
                </div>
            </form>
        );
    }

    renderTrendResults()
    {
        if (this.state.trendResults.length > 0)
        {
            return (
                <div>
                    <input class="form-control mb-4 mt-4" type="text" placeholder="Filter Results" onKeyUp={this.onKeyUpFilter} />
                    <table class="table table-hover sortable">
                        <thead class="thead-dark">
                            <tr>
                                <th>Animal</th>
                                <th>Trending</th>
                            </tr>
                        </thead>
                        <tbody ref={ref => this.trendTable = ref}>
                            {this.state.trendResults.map(result =>
                                <tr>
                                    <td>{result.animal}</td>
                                    <td>{result.trending}</td>
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
        return this.state.noResults ? <div class="alert alert-info mt-4" role="alert">There were no species found given the trending criteria</div> : null;
    }

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

            return locations.map(location => ({
                value: location.locationID,
                label: location.county + ', ' + location.state
            }));
        }
        else
        {
            callback([]);
        }
    }

    onKeyUpFilter(event)
    {
        const filter = event?.target?.value?.toUpperCase() || ""; // Contains the value in the trend field
        const rows = this.trendTable?.getElementsByTagName("tr");

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

    onChangeLocation(location)
    {
        this.setState({ locationOption: location, locationID: location?.value });
    }

    onChangeDate(event)
    {
        this.setState({ date: event?.target?.value });
    }

    onTrendClicked(event)
    {
        event.preventDefault(); // Prevent the page from refreshing
        this.trend();
    }

    async trend()
    {
        const params = { date: this.state.date ? this.state.date : new Date().toLocaleDateString(), locationID: this.state.locationID };
        const query = Object.keys(params)
            .map(index => encodeURIComponent(index) + '=' + encodeURIComponent(params[index]))
            .join('&');

        const response = await fetch("api/trend?" + query, { method: 'GET' });

        if (response.ok)
        {
            const data = await response.json();

            if (data.length > 0)
            {
                this.setState({ trendResults: data, noResults: false });
            }
            else
            {
                this.setState({ trendResults: [], noResults: true });
            }
        }
        else
        {
            this.setState({ trendResults: [], noResults: true });
        }
    }
}

