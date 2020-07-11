import React, { Component } from 'react';

export class Trend extends Component {
    static displayName = Trend.name;

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

    trendDate = '';
    trendAnimal = '';
    trendCounty = '';
    trendState = '';
    trendLocation = '';

    constructor(props)
    {
        super(props);
        this.state = { trendResults: [] };

        this.onKeyUpFilter = this.onKeyUpFilter.bind(this);
        this.onChangeAnimal = this.onChangeAnimal.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeCounty = this.onChangeCounty.bind(this);
        this.onChangeState = this.onChangeState.bind(this);
        this.onTrendClicked = this.onTrendClicked.bind(this);
    }

    componentDidMount()
    {

    }

    render()
    {
        let contents = this.state.trendResults.length > 0 ? this.renderTrendResults(this.state.trendResults) : null;

        return (
            <div>
                <h1>Trending Near You</h1>
                {this.renderTrendCriteria()}
                {contents}
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
                        <input id="date" type="date" class="form-control" placeholder="Date" onChange={this.onChangeDate} />
                    </div>
                    <div class="form-group col-md-3">
                        <label for="county">County</label>
                        <input id="county" type="text" class="form-control" placeholder="County" onChange={this.onChangeCounty} />
                    </div>
                    <div class="form-group col-md-3">
                        <label for="state">State</label>
                        <select id="state" class="form-control" trendable="State" onChange={this.onChangeState}>
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
                        <button class="btn btn-primary float-right" onClick={this.onTrendClicked}>Search</button>
                    </div>
                </div>
            </form>
        );
    }

    renderTrendResults(trendResults)
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
                        {trendResults.map(result =>
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

    onChangeAnimal(event)
    {
        this.trendAnimal = event?.target?.value;
    }

    onChangeDate(event)
    {
        this.trendDate = event?.target?.value;
    }

    onChangeCounty(event)
    {
        this.trendCounty = event?.target?.value;
    }

    onChangeState(event)
    {
        this.trendState = event?.target?.value;
    }

    onTrendClicked(event)
    {
        event.preventDefault(); // Prevent the page from refreshing
        this.trend();
    }

    async trend()
    {
        const params = { date: this.trendDate ? this.trendDate : new Date().toLocaleDateString(), animal: this.trendAnimal, county: this.trendCounty, state: this.trendState };
        const query = Object.keys(params)
            .map(index => encodeURIComponent(index) + '=' + encodeURIComponent(params[index]))
            .join('&');

        const response = await fetch("trend?" + query, { method: 'GET' });
        const data = await response.json();
        this.setState({ trendResults: data });
    }
}

