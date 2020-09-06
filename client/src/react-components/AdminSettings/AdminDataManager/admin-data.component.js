import React, { Component } from "react";
import "./admin-data.css";
export default class AdminData extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataType: "user",
            //family and tribe
            familyName: "",
            tribeName: "",

            // users
            username: "",
            name: "",
            password: "",
            email: "",

            //store
            storeAddress: "",
            wait: "",
            coordinates: "0",
            storeName: "",
        };
        this.familyMode = this.familyMode.bind(this);
        this.storeMode = this.storeMode.bind(this);
        this.tribeMode = this.tribeMode.bind(this);
        this.userMode = this.userMode.bind(this);

        this.onInputChange = this.onInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    userMode() {
        this.setState({ dataType: "user" });
    }
    familyMode() {
        this.setState({ dataType: "family" });
    }
    storeMode() {
        this.setState({ dataType: "store" });
    }
    tribeMode() {
        this.setState({ dataType: "tribe" });
    }
    onInputChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    /*
        Creates a new list of what needs to be updated and then pushes it up to the admin settings (parent) for
        universal changes including the database.
    */
    async handleSubmit(e) {
        e.preventDefault();
        if (this.state.dataType === "user" && this.state.dataType.length > 0) {
            let allUsers = this.props.allUsers;

            if (allUsers[this.state.username] === undefined) {
                allUsers[this.state.username] = this.state.allUsers;
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
                            username: this.state.username,
                            password: this.state.password,
                            name: this.state.name,
                            email: this.state.email,
                        }),
                    });

                    if (response.status < 400) {
                        alert(`Added ${this.state.username}`);
                    } else {
                        alert(
                            `Failed to add make sure the email/username are unique and the password is longer than 4 characters`
                        );
                    }
                } catch (err) {
                    console.log(err);
                    alert(
                        "Something went wrong. Make sure you are following the schema"
                    );
                }
            } else {
            }
        } else if (
            this.state.dataType === "family" &&
            this.state.dataType.length > 0
        ) {
            try {
                const response = await fetch("/admin/family", {
                    method: "POST",
                    crossDomain: true,
                    credentials: "include",
                    redirect: "follow",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    referrerPolicy: "no-referrer",
                    body: JSON.stringify({
                        familyName: this.state.familyName,
                    }),
                });

                if (response.status < 400) {
                    alert(`Added ${this.state.familyName}`);
                } else {
                    alert("Something went wrong!");
                }
            } catch (err) {
                console.log(err);
                alert(
                    "Something went wrong. Make sure you are following the schema"
                );
            }
            //this.props.addNewData(allUsers, this.state.dataType);
        } else if (this.state.dataType === "store") {
            let allStores = this.props.allStores;
            if (
                allStores[this.state.storeAddress] === undefined &&
                this.state.storeAddress.length > 0
            ) {
                try {
                    const response = await fetch("/MapList", {
                        method: "POST",
                        crossDomain: true,
                        credentials: "include",
                        redirect: "follow",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        referrerPolicy: "no-referrer",
                        body: JSON.stringify({
                            name: this.state.storeName,
                            address: this.state.storeAddress,
                            open: "true",
                            wait: this.state.wait,
                            coordinates: this.state.coordinates,
                        }),
                    });
                    if (response.status < 400) {
                        alert(`Added ${this.state.storeName}`);
                    } else {
                        alert(
                            "Something went wrong. Make sure you are following the schema"
                        );
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        } else if (this.state.dataType === "tribe") {
            let allTribes = this.props.allTribes;
            if (
                allTribes[this.state.tribeName] === undefined &&
                this.state.dataType.length > 0
            ) {
                try {
                    const response = await fetch("/admin/tribe", {
                        method: "POST",
                        crossDomain: true,
                        credentials: "include",
                        redirect: "follow",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        referrerPolicy: "no-referrer",
                        body: JSON.stringify({
                            tribeName: this.state.tribeName,
                        }),
                    });

                    if (response.status < 400) {
                        alert(`Added ${this.state.tribeName}`);
                    } else {
                        alert("Something went wrong!");
                    }
                } catch (err) {
                    console.log(err);
                    alert(
                        "Something went wrong. Make sure you are following the schema"
                    );
                }
                //this.props.addNewData(allUsers, this.state.dataType);
            }
        }
        await this.props.getAllData();
    }

    render() {
        const userData = (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input
                        className="AdminData-input"
                        name="username"
                        type="text"
                        placeholder="Enter username"
                        onChange={this.onInputChange}
                        value={this.state.username}
                        autoComplete="off"
                    />
                    <input
                        className="AdminData-input"
                        name="email"
                        type="text"
                        placeholder="Enter email"
                        onChange={this.onInputChange}
                        value={this.state.email}
                        autoComplete="off"
                    />
                    <input
                        className="AdminData-input"
                        name="name"
                        type="text"
                        placeholder="Enter a name"
                        onChange={this.onInputChange}
                        value={this.state.name}
                        autoComplete="off"
                    />
                    <input
                        className="AdminData-input"
                        name="password"
                        type="password"
                        placeholder="Enter a password"
                        onChange={this.onInputChange}
                        value={this.state.password}
                        autoComplete="off"
                    />

                    <button className="btn btn-primary btn-add">
                        Add User
                    </button>
                </form>
            </div>
        );

        const familyData = (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input
                        className="AdminData-input"
                        name="familyName"
                        type="text"
                        placeholder="Enter family's name"
                        onChange={this.onInputChange}
                        value={this.state.familyName}
                        autoComplete="off"
                    />
                    <button className="btn btn-primary btn-add">
                        Add Family
                    </button>
                </form>
            </div>
        );

        const storeData = (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input
                        className="AdminData-input"
                        name="storeAddress"
                        type="text"
                        placeholder="Enter store address"
                        onChange={this.onInputChange}
                        value={this.state.storeAddress}
                        autoComplete="off"
                    />
                    <input
                        className="AdminData-input"
                        name="storeName"
                        type="text"
                        placeholder="Enter store name"
                        onChange={this.onInputChange}
                        value={this.state.storeName}
                        autoComplete="off"
                    />

                    <input
                        className="AdminData-input"
                        name="wait"
                        type="text"
                        placeholder="Enter stores wait time"
                        onChange={this.onInputChange}
                        value={this.state.wait}
                        autoComplete="off"
                    />
                    <input
                        className="AdminData-input"
                        name="coordinates"
                        type="text"
                        placeholder="Enter store coordinates"
                        onChange={this.onInputChange}
                        value={this.state.coordinates}
                        autoComplete="off"
                    />
                    <button className="btn btn-primary btn-add">
                        Add Store
                    </button>
                </form>
            </div>
        );

        const tribeData = (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input
                        className="AdminData-input"
                        name="tribeName"
                        type="text"
                        placeholder="Enter tribe name"
                        onChange={this.onInputChange}
                        value={this.state.tribeName}
                        autoComplete="off"
                    />

                    <button className="btn btn-primary btn-add">
                        Add Tribe
                    </button>
                </form>
            </div>
        );
        return (
            <div className="AdminData">
                <p>Add data</p>
                <div className="btn-group" role="group">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={this.userMode}
                    >
                        User
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={this.familyMode}
                    >
                        Family
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={this.storeMode}
                    >
                        Store
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={this.tribeMode}
                    >
                        Tribe
                    </button>
                </div>
                {this.state.dataType === "user" ? userData : ""}
                {this.state.dataType === "family" ? familyData : ""}
                {this.state.dataType === "store" ? storeData : ""}
                {this.state.dataType === "tribe" ? tribeData : ""}
            </div>
        );
    }
}
