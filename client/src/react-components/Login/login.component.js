import React, { Component } from "react";
import "./login.component.css";
import { Route } from "react-router-dom";
//import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
//import Map from "../Maps/maps.component.js";
export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            isError: false,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    /*
    This function will have to contact the server to recieve information about the users credentials.
    Example: if passsword or username is incorrect and possibly to also recieve cookies.
    */

    async handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await fetch("/users/login", {
                method: "POST",
                crossDomain: true,
                credentials: "include",
                redirect: "follow",
                headers: {
                    "Content-Type": "application/json",
                },
                referrerPolicy: "no-referrer",
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password,
                }),
            });
            if (response.status < 400) {
                this.state.isError = false; // removes error message
                const user = await response.json();
                await this.props.determinePermissions(user); // Update the App()
            } else {
                this.setState({ isError: true });
            }
        } catch (err) {
            console.log(err);
        }
    }
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        return (
            <div className="container-xl">
                <p>
                    <strong>Welcome to Project Ceres </strong>
                </p>
                {this.state.isError ? (
                    <p className="red">
                        <strong>Invalid Credentials</strong>
                    </p>
                ) : (
                    ""
                )}
                <div className="row Login-box">
                    <div className="col-sm">
                        <form
                            className="Login-form"
                            onSubmit={this.handleSubmit}
                        >
                            <input
                                className="Login-input"
                                type="username"
                                name="username"
                                placeholder=" Username"
                                value={this.state.username}
                                onChange={this.handleChange}
                                required
                            />

                            <input
                                className="Login-input"
                                type="password"
                                name="password"
                                placeholder=" Password"
                                value={this.state.password}
                                onChange={this.handleChange}
                                required
                            />

                            <button
                                className="btn btn-success btn-login"
                                type="submit"
                            >
                                Login
                            </button>
                        </form>
                        <p className="Login-register">
                            Don't have an account?{" "}
                        </p>
                        <a className="Login-register" href="/register">
                            {<Route exact to="/register" />}
                            Click to register
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}
