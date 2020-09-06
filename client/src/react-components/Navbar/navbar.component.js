import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import logo from "./../../images/logo.png";
export default class Navbar extends Component {
    render() {
        const adminLink = (
            <li className="navbar-item">
                <Link to="/admin" className="nav-link">
                    Admin Settings
                </Link>
            </li>
        );
        const navBar = (
            <nav className="barcolor navbar navbar-light navbar-expand-lg bg-prime">
                <Link to="/" className="navbar-brand">
                    <img src={logo} className="logo" alt="logo" /> Project Ceres
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target=".navbar-collapse"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mr-auto">
                        <li className="navbar-item">
                            <Link to="/map" className="nav-link">
                                Map
                            </Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/tribe" className="nav-link">
                                Tribe
                            </Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/grocerylists" className="nav-link">
                                Grocery Lists
                            </Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav ml-auto">
                        {this.props.isAdmin ? adminLink : ""}
                        <li className="navbar-item">
                            <Link to="/profile" className="nav-link">
                                Profile
                            </Link>
                        </li>
                        <li className="navbar-item">
                            <Link
                                className="btn btn-danger nav-link btn-log"
                                to="/map"
                                onClick={this.props.logout}
                            >
                                Logout
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        );
        const loginNav = (
            <nav className="barcolor bg-prime navbar navbar-light navbar-expand-lg">
                <ul className="navbar-nav mr-auto">
                    <li className="navbar-item">
                        <Link to="/" className="navbar-brand">
                            <img src={logo} className="logo" alt="logo" />{" "}
                            Project Ceres
                        </Link>
                    </li>
                </ul>

                <ul className="navbar-nav ml-auto">
                    <li className="navbar-item">
                        <Link
                            className="btn  btn-secondary nav-link btn-log"
                            to="/login"
                        >
                            Login
                        </Link>
                    </li>
                    <li className="navbar-item">
                        <Link
                            className="btn  btn-secondary nav-link btn-log"
                            to="/register"
                        >
                            Register
                        </Link>
                    </li>
                </ul>
            </nav>
        );
        return <div>{this.props.loggedIn ? navBar : loginNav}</div>;
    }
}
