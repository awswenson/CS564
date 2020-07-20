import React, { Component } from 'react';
import AsyncSelect from 'react-select/async';

export class Trend extends Component {
    static displayName = Trend.name;

    constructor(props)
    {
        super(props);
        this.state = { trendResults: [], mammalResults: [],birdResults: [],reptileResults: [] , date: '', locationOption: '', locationID: '', noResults: false };

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
                {this.renderMammalResults()}
                {this.renderAvianResults()}
                {this.renderReptileResults()}
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

    /**
     * Renders top 5 most sighted animals
     */
    renderTrendResults() { 
        if (this.state.trendResults.length > 0) {
            return (
                <div>
                    <h2>Top Observed Animals </h2>
                    <table class="table table-hover sortable">
                        <thead class="thead-dark">
                            <tr>
                                <th>Animal</th>
                                <th>Class</th>
                                <th>Trending</th>
                            </tr>
                        </thead>
                        <tbody ref={ref => this.trendTable = ref}>
                            {this.state.trendResults.map(result =>
                                <tr>
                                    <td>{result.animal}</td>
                                    <td>{result.class}</td>
                                    <td>{result.trending}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            );
        }
    }

    /**
     * Renders most sighted mammals
     */
    renderMammalResults() { 
        if (this.state.mammalResults.length > 0) {
            return (
                <div>
                    <h2><img src="https://static.thenounproject.com/png/166727-200.png" alt="Squirrel" width="100" height="100" /> Trending Mammals </h2>
                    <table class="table table-hover sortable">
                        <thead class="thead-dark">
                            <tr>
                                <th>Animal</th>
                                <th>Trending</th>
                            </tr>
                        </thead>
                        <tbody ref={ref => this.trendTable = ref}>
                            {this.state.mammalResults.map(result =>
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

    /**
     * Renders most sighted birds
     */
    renderAvianResults() {
        if (this.state.birdResults.length > 0) {
            return (
                <div>
                    <h2><img src="https://static.thenounproject.com/png/1211525-200.png" alt="Bird" width="100" height="100" /> Trending Birds </h2>
                    <table class="table table-hover sortable">
                        <thead class="thead-dark">
                            <tr>
                                <th>Animal</th>
                                <th>Trending</th>
                            </tr>
                        </thead>
                        <tbody ref={ref => this.trendTable = ref}>
                            {this.state.birdResults.map(result =>
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

    /**
     * Renders most sighted reptiles
     */
    renderReptileResults() {
        if (this.state.reptileResults.length > 0) {
            return (
                <div>
                    <h2><img src='https://icon-library.com/images/reptile-icon/reptile-icon-8.jpg' alt="Lizard" width="100" height="100" /> Trending Reptiles </h2>
                    <table class="table table-hover sortable">
                        <thead class="thead-dark">
                            <tr>
                                <th>Animal</th>
                                <th>Trending</th>
                            </tr>
                        </thead>
                        <tbody ref={ref => this.trendTable = ref}>
                            {this.state.reptileResults.map(result =>
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
        let params;

        if (this.state.date)
        {
            params = { date: this.state.date, locationID: this.state.locationID };
        }
        else // Use today's date for the search
        {
            const date = new Date();
            const day = ("0" + date.getDate()).slice(-2);
            const month = ("0" + (date.getMonth() + 1)).slice(-2);

            this.setState({ date: date.getFullYear() + "-" + (month) + "-" + (day) });

            params = { date: date.toLocaleDateString(), locationID: this.state.locationID };
        }

        const query = Object.keys(params)
            .map(index => encodeURIComponent(index) + '=' + encodeURIComponent(params[index]))
            .join('&');

        const response = await fetch("api/trend?" + query, { method: 'GET' });

        if (response.ok)
        {
            const data = await response.json();  
            const hasResults = data.top5Animals?.length > 0 || data.mammals?.length > 0 || data.birds?.length > 0 || data.reptiles?.length > 0;

            this.setState({
                trendResults: data.top5Animals?.length > 0 ? data.top5Animals : [],
                mammalResults: data.mammals?.length > 0 ? data.mammals : [],
                birdResults: data.birds?.length > 0 ? data.birds : [],
                reptileResults: data.reptiles?.length > 0 ? data.reptiles : [],
                noResults: !hasResults
            })
        }
        else 
        {
            this.setState({ trendResults: [], mammalResults: [], birdResults: [], reptileResults: [], noResults: true });
        }
    }
}

