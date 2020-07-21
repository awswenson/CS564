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
                    The primary objectives of the application are as follows:
                </p>
                <ul>
                    <li>View the top trending species by location and time of year, ranked by number of observations</li>
                    <li>View the top trending species for a given class</li>
                    <li>Insert, edit, and delete observations</li>
                </ul>
            </div>
        );
    }
}
