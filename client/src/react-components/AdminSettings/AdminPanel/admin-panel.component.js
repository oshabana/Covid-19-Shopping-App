import React, { Component } from "react";

import "./admin-panel.css";

export default class AdminPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            displayType: this.props.displayType,
            selectedItem: this.props.selectedItem,
            selectedObj: this.props.selectedObj,
        };

        this.displayInfo = this.displayInfo.bind(this);
        this.deleteObj = this.deleteObj.bind(this);
        this.editDB = this.editDB.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.selectedObj !== this.props.selectedObj) {
            if (this.props.displayType === "user") {
                const selectedObj = this.props.selectedObj;
                for (let key in selectedObj) {
                    this.setState({ [key]: selectedObj[key] });
                }
            }
            if (this.props.displayType === "family") {
                const selectedObj = this.props.selectedObj;
                for (let key in selectedObj) {
                    this.setState({ [key]: selectedObj[key] });
                }
            }
            if (this.props.displayType === "store") {
                const selectedObj = this.props.selectedObj;
                for (let key in selectedObj) {
                    this.setState({ [key]: selectedObj[key] });
                }
            }
            if (this.props.displayType === "tribe") {
                const selectedObj = this.props.selectedObj;
                for (let key in selectedObj) {
                    this.setState({ [key]: selectedObj[key] });
                }
            }
        }
    }

    deleteObj() {
        this.props.deleteObj(this.props.selectedItem, this.props.displayType);
    }

    async editDB(e) {
        e.preventDefault();

        const param = e.target.childNodes[1].name;
        const value = e.target.childNodes[1].value;

        if (this.props.displayType === "user") {
            try {
                const response = await fetch("/users", {
                    method: "PATCH",
                    crossDomain: true,
                    credentials: "include",
                    redirect: "follow",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    referrerPolicy: "no-referrer",
                    body: JSON.stringify({
                        userID: this.props.selectedObj["_id"],
                        change: [param, value],
                    }),
                });

                if (response.status < 400) {
                    alert("Updated!");
                    this.setState({ [param]: value });
                } else {
                    alert("Something went wrong!");
                }
            } catch (err) {
                console.log(err);
                alert("Something went wrong!");
            }
        } else if (this.props.displayType === "family") {
            try {
                const response = await fetch("/family", {
                    method: "PATCH",
                    crossDomain: true,
                    credentials: "include",
                    redirect: "follow",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    referrerPolicy: "no-referrer",
                    body: JSON.stringify({
                        familyID: this.props.selectedObj["_id"],
                        change: [param, value],
                    }),
                });

                if (response.status < 400) {
                    alert("Updated!");
                    this.setState({ [param]: value });
                } else {
                    alert("Something went wrong!");
                }
            } catch (err) {
                console.log(err);
                alert("Something went wrong!");
            }
        } else if (this.props.displayType === "tribe") {
            try {
                const response = await fetch("/tribe", {
                    method: "PATCH",
                    crossDomain: true,
                    credentials: "include",
                    redirect: "follow",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    referrerPolicy: "no-referrer",
                    body: JSON.stringify({
                        tribeID: this.props.selectedObj["_id"],
                        change: [param, value],
                    }),
                });

                if (response.status < 400) {
                    alert("Updated!");
                    this.setState({ [param]: value });
                } else {
                    alert("Something went wrong!");
                }
            } catch (err) {
                console.log(err);
                alert("Something went wrong!");
            }
        } else if (this.props.displayType === "store") {
            try {
                const response = await fetch("/MapList", {
                    method: "PATCH",
                    crossDomain: true,
                    credentials: "include",
                    redirect: "follow",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    referrerPolicy: "no-referrer",
                    body: JSON.stringify({
                        storeID: this.props.selectedObj["_id"],
                        change: [param, value],
                    }),
                });

                if (response.status < 400) {
                    alert("Updated!");
                    this.setState({ [param]: value });
                } else {
                    alert("Something went wrong!");
                }
            } catch (err) {
                console.log(err);
                alert("Something went wrong!");
            }
        }
        await this.props.getAllData();
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    displayInfo() {
        const deleteButton = (
            <button className="btn btn-danger" onClick={this.deleteObj}>
                Delete
            </button>
        );
        if (
            this.props.selectedObj !== undefined &&
            this.props.displayType === "family"
        ) {
            let families = this.props.selectedObj;

            for (let family in families) {
                return (
                    <div>
                        <div className="AdminPanel-tribe-members">
                            {Object.keys(families).map((key) => (
                                <div className="info" key={key}>
                                    <form onSubmit={this.editDB}>
                                        <p>{key}</p>
                                        <input
                                            type="text"
                                            name={key}
                                            onChange={this.onChange}
                                            value={
                                                this.state[key]
                                                    ? this.state[key]
                                                    : ""
                                            }
                                        />
                                        <button className="send-changes">
                                            Send Change
                                        </button>
                                    </form>
                                    <br></br>
                                </div>
                            ))}
                        </div>
                        {deleteButton}
                    </div>
                );
            }
        } else if (
            //users
            this.props.selectedObj !== undefined &&
            this.props.displayType === "user"
        ) {
            let users = this.props.selectedObj;

            if (users !== undefined) {
                for (let key in users) {
                    return (
                        <div>
                            <div className="AdminPanel-tribe-members">
                                {Object.keys(users).map((key) =>
                                    key !== "password" ? (
                                        <div className="info" key={key}>
                                            <form onSubmit={this.editDB}>
                                                <p>{key}</p>
                                                <input
                                                    type="text"
                                                    name={key}
                                                    onChange={this.onChange}
                                                    value={
                                                        this.state[key]
                                                            ? this.state[key]
                                                            : ""
                                                    }
                                                />
                                                <button className="send-changes">
                                                    Send Change
                                                </button>
                                            </form>
                                            <br></br>
                                        </div>
                                    ) : (
                                        ""
                                    )
                                )}
                            </div>
                            {deleteButton}
                        </div>
                    );
                }
            }
        } else if (
            this.props.selectedObj !== undefined &&
            this.props.displayType === "store"
        ) {
            let stores = this.props.selectedObj;

            for (let store in stores) {
                return (
                    <div>
                        <div className="AdminPanel-tribe-members">
                            {Object.keys(stores).map((key) => (
                                <div className="info" key={key}>
                                    <form onSubmit={this.editDB}>
                                        <p>{key}</p>
                                        <input
                                            type="text"
                                            name={key}
                                            onChange={this.onChange}
                                            value={
                                                this.state[key]
                                                    ? this.state[key]
                                                    : ""
                                            }
                                        />
                                        <button className="send-changes">
                                            Send Change
                                        </button>
                                    </form>
                                    <br></br>
                                </div>
                            ))}
                        </div>
                        {deleteButton}
                    </div>
                );
            }
        } else if (
            this.props.selectedObj !== undefined &&
            this.props.displayType === "tribe"
        ) {
            let tribes = this.props.selectedObj;

            for (let tribe in tribes) {
                return (
                    <div>
                        <div className="AdminPanel-tribe-members">
                            {Object.keys(tribes).map((key) => (
                                <div className="info" key={key}>
                                    <form onSubmit={this.editDB}>
                                        <p>{key}</p>
                                        <input
                                            type="text"
                                            name={key}
                                            onChange={this.onChange}
                                            value={
                                                this.state[key]
                                                    ? this.state[key]
                                                    : ""
                                            }
                                        />
                                        <button className="send-changes">
                                            Send Change
                                        </button>
                                    </form>
                                    <br></br>
                                </div>
                            ))}
                        </div>
                        {deleteButton}
                    </div>
                );
            }
        }
    }

    render() {
        return (
            <div className="AdminPanel">
                <p>If an input is blank then it is an array or object</p>
                {this.displayInfo()}
            </div>
        );
    }
}
