import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "./Register.css";
import * as EmailValidator from "email-validator";
//import Login from "../Login/login.component";
//import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
//import Map from "../Maps/maps.component.js";
export default class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            username: "",
            name: "",
            password: "",
            passwordRetyped: "",
            isUserNameError: false,
            isUserEmailError: false,
            isUserPasswordError: false,
            isSuccessful: false,
            isFormatError: false,
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
        if (!EmailValidator.validate(this.state.email)) {
            this.setState({
                isFormatError: true,
                isUserPasswordError: false,
                isUserEmailError: false,
                isUserNameError: false,
            });
            return;
        }
        if (
            this.state.password.length > 3 &&
            this.state.password === this.state.passwordRetyped
        ) {
            try {
                const response = await fetch("/users", {
                    method: "POST",
                    crossDomain: true,
                    credentials: "include",
                    redirect: "follow",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    referrerPolicy: "no-referrer",
                    body: JSON.stringify({
                        email: this.state.email,
                        name: this.state.name,
                        username: this.state.username,
                        password: this.state.password,
                    }),
                });
                if (response.status > 399) {
                    const error = await response.json();
                    if (error.email) {
                        this.setState({
                            isUserEmailError: true,
                            isFormatError: false,
                            isUserPasswordError: false,
                            isUserNameError: false,
                        });
                    } else {
                        this.setState({
                            isUserPasswordError: false,
                            isFormatError: false,
                            isUserEmailError: false,
                            isUserNameError: true,
                        });
                    }
                    return;
                }
                alert("Thank you for registering!");
                this.setState({ isSuccessful: true });
            } catch (err) {
                console.log(err);
            }
        } else
            this.setState({
                isUserPasswordError: true,
                isUserEmailError: false,
                isUserNameError: false,
                isFormatError: false,
            });
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

                {this.state.isSuccessful ? (
                    <p className="green">
                        <strong>{<Redirect to="/login" />}</strong>
                    </p>
                ) : (
                    ""
                )}
                {this.state.isFormatError ? (
                    <p className="red">
                        <strong>This is not a valid email address</strong>
                    </p>
                ) : (
                    ""
                )}
                {this.state.isUserNameError ? (
                    <p className="red">
                        <strong>This username has already been taken </strong>
                    </p>
                ) : (
                    ""
                )}
                {this.state.isUserPasswordError ? (
                    <p className="red">
                        <strong>
                            Passwords must be longer than 4 characters and must
                            match
                        </strong>
                    </p>
                ) : (
                    ""
                )}
                {this.state.isUserEmailError ? (
                    <p className="red">
                        <strong>This email has already been taken </strong>
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
                                type="email"
                                name="email"
                                placeholder=" Email"
                                value={this.state.email}
                                onChange={this.handleChange}
                                required
                            />
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
                                type="name"
                                name="name"
                                placeholder=" name"
                                value={this.state.name}
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
                            <input
                                className="Login-input"
                                type="password"
                                name="passwordRetyped"
                                placeholder="Retype Password"
                                value={this.state.passwordRetyped}
                                onChange={this.handleChange}
                                required
                            />

                            <button
                                className="btn btn-success btn-login"
                                type="submit"
                            >
                                Register
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
