import React, { Component } from 'react';

export class Home extends Component {
    static displayName = Home.name;

    render() {
        return (
            <div>
                <h1>Home</h1>
                <p>This web-application was built by Alex Swenson, Austin Steltz, and John O'Bryan for a CS 564 project at UW-Madison. It was built as a proof of concept to support and automate the most
                    common workflows performed by the leading types of nature enthusiasts (e.g.hikers, wildlife photographers, birders, beachcombers, mushroom foragers, park rangers, and ecologists).
                </p>
                <p>
                    The main feature of the application will be the retrieval and summarization of wildlife into ranked trending lists based on the entry of a geographic
                    location and time of year. The user will be able to:
                </p>
                <ul>
                    <li>View the top trending species (ranked by number of observations) by a location and the time of year</li>
                    <li>Filter the trending species by selecting a specific phylum, class, or kingdom</li>
                    <li>Log ad-hoc observations</li>
                    <li>Modify and delete previous observations</li>
                </ul>
            </div>
        );
    }
}
