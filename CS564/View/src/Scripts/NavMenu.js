import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import '../Styles/NavMenu.css';

export class NavMenu extends Component {
    static displayName = NavMenu.name;

    constructor(props) {
        super(props);

        this.state = { collapsed: true };

        this.toggleNavbar = this.toggleNavbar.bind(this);
    }

    toggleNavbar() {
        this.setState({ collapsed: !this.state.collapsed });
    }

    render() {
        return (
            <header>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow mb-3 navbar-dark bg-dark">
                    <Container>
                        <NavbarBrand tag={Link} to="/">Wildlife Trending</NavbarBrand>
                        <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
                        <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
                            <ul className="navbar-nav flex-grow">
                                <NavItem>
                                    <NavLink tag={Link} to="/">Home</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} to="/search">Search</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} to="/observations">Observations</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} to="/trips">Trips</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} to="/profile">Profile</NavLink>
                                </NavItem>
                            </ul>
                        </Collapse>
                    </Container>
                </Navbar>
            </header>
        );
    }
}
