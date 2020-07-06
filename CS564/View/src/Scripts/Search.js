import React, { Component } from 'react';

export class Search extends Component {
    static displayName = Search.name;

    states = [
        "Alabama",
        "Alaska",
        "Arizona",
        "Arkansas",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "Florida",
        "Georgia",
        "Hawaii",
        "Idaho",
        "Illnois",
        "Indiana",
        "Iowa",
        "Kansas",
        "Kentucky",
        "Louisiana",
        "Maine",
        "Maryland",
        "Massachusetts",
        "Michigan",
        "Minnesota",
        "Mississippi",
        "Missouri",
        "Montana",
        "Nebraska",
        "Nevada",
        "New Hampshire",
        "New Jersey",
        "New Mexico",
        "New York",
        "North Carolina",
        "North Dakota",
        "Ohio",
        "Oklahoma",
        "Oregon",
        "Pennsylvania",
        "Rhode Island",
        "South Carolina",
        "South Dakota",
        "Tennessee",
        "Texas",
        "Utah",
        "Vermont",
        "Virginia",
        "Washington",
        "West Virginia",
        "Wisconsin",
        "Wyoming"
    ];

    searchDate = '';
    searchAnimal = '';
    searchCounty = '';
    searchState = '';

    constructor(props)
    {
        super(props);
        this.state = { searchResults: [] };

        this.onKeyUpFilter = this.onKeyUpFilter.bind(this);
        this.onChangeAnimal = this.onChangeAnimal.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeCounty = this.onChangeCounty.bind(this);
        this.onChangeState = this.onChangeState.bind(this);
        this.onSearchClicked = this.onSearchClicked.bind(this);
    }

    componentDidMount()
    {

    }

    render()
    {
        let contents = this.state.searchResults.length > 0 ? this.renderSearchResults(this.state.searchResults) : null;

        return (
            <div>
                <h1>Search</h1>
                {this.renderSearchCriteria()}
                {contents}
            </div>
        );
    }

    renderSearchCriteria()
    {
        return (
            <form class="form-content">
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label for="date">Date</label>
                        <input id="date" type="date" class="form-control" placeholder="Date" onChange={this.onChangeDate} />
                    </div>
                    <div class="form-group col-md-3">
                        <label for="county">County</label>
                        <input id="county" type="text" class="form-control" placeholder="County" onChange={this.onChangeCounty} />
                    </div>
                    <div class="form-group col-md-3">
                        <label for="state">State</label>
                        <select id="state" class="form-control" searchable="State" onChange={this.onChangeState}>
                            <option value="" disabled selected>State</option>
                            {this.states.map(state =>
                                <option value={state}>{state}</option>
                            )}
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label for="animal">Animal</label>
                        <input id="animal" type="text" class="form-control" placeholder="Animal" onChange={this.onChangeAnimal} />
                    </div>
                </div>
                <div class="form-row">
                    <div class="col">
                        <button class="btn btn-primary float-right" onClick={this.onSearchClicked}>Search</button>
                    </div>
                </div>
            </form>
        );
    }

    renderSearchResults(searchResults)
    {
        return (
            <div>
                <input class="form-control mb-4 mt-4" type="text" placeholder="Filter Results" onKeyUp={this.onKeyUpFilter} />
                <table class="table table-hover sortable">
                    <thead class="thead-dark">
                        <tr>
                            {this.searchDate ? null : <th>Date</th>}
                            {this.searchCounty && this.searchState ? null : <th>Location</th>}
                            <th>Animal</th>
                            <th>Trending</th>
                        </tr>
                    </thead>
                    <tbody ref={ref => this.searchTable = ref}>
                        {searchResults.map(result =>
                            <tr>
                                {this.searchDate ? null : <td>{this.convertDate(result.date)}</td>}
                                {this.searchCounty && this.searchState ? null : <td>{result.location}</td>}
                                <td>{result.animal}</td>
                                <td>{result.trending}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }

    onKeyUpFilter(event)
    {
        const filter = event?.target?.value?.toUpperCase() || ""; // Contains the value in the search field
        const rows = this.searchTable?.getElementsByTagName("tr");

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

    convertDate(dateTime)
    {
        if (!dateTime)
        {
            return "";
        }

        const date = new Date(dateTime);

        return date ? date.toLocaleDateString() : "";
    }

    onChangeAnimal(event)
    {
        this.searchAnimal = event?.target?.value;
    }

    onChangeDate(event)
    {
        this.searchDate = event?.target?.value;
    }

    onChangeCounty(event)
    {
        this.searchCounty = event?.target?.value;
    }

    onChangeState(event)
    {
        this.searchState = event?.target?.value;
    }

    onSearchClicked(event)
    {
        event.preventDefault(); // Prevent the page from refreshing
        this.search();
    }

    async search()
    {
        const params = { date: this.searchDate ? this.searchDate : new Date().toLocaleDateString(), animal: this.searchAnimal, county: this.searchCounty, state: this.searchState };
        const query = Object.keys(params)
            .map(index => encodeURIComponent(index) + '=' + encodeURIComponent(params[index]))
            .join('&');

        const response = await fetch("search?" + query, { method: 'GET' });
        const data = await response.json();
        this.setState({ searchResults: data });
    }
}

