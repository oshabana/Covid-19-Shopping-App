/*
This page is the main page for this feature. Everything in AdminSettings is called from within here 
or a child. All server calls will be done from the page as it is the first and last to view any changes made thus
it sends and recieves the most up to date information.
*/

import React, { Component } from "react";
import "./admin-settings.css";
import AdminSearch from "./AdminSearch/admin-search.component";
import AdminPanel from "./AdminPanel/admin-panel.component";
import AdminData from "./AdminDataManager/admin-data.component";
import Unauthorized from "../Errors/Unauthorized";
export default class AdminSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allUsers: {},
            allFamilies: {},
            allStores: {},
            allTribes: {},
            displayType: "",
            selectedItem: "",
            selectedObj: {},
        };
        this.parseUserData = this.parseUserData.bind(this);
        this.parseFamilyData = this.parseFamilyData.bind(this);
        this.parseStoreData = this.parseStoreData.bind(this);
        this.parseTribeData = this.parseTribeData.bind(this);

        this.showOnPanel = this.showOnPanel.bind(this);
        this.deleteObj = this.deleteObj.bind(this);
        this.addNewData = this.addNewData.bind(this);
        this.getAllData = this.getAllData.bind(this);
    }

    async componentDidMount() {
        if (this.props.user !== null) {
            await this.getAllData();
        }
    }
    parseUserData() {
        const users = this.state.allUsers;
        const newUserData = {};
        for (let key in users) {
            let thisUserName = users[key]["username"];
            newUserData[thisUserName] = users[key];
        }

        this.setState({ allUsers: newUserData });
    }
    parseFamilyData() {
        const families = this.state.allFamilies;
        const newFamilyData = {};
        for (let key in families) {
            let thisFamilyName = families[key]["familyName"];
            newFamilyData[thisFamilyName] = families[key];
        }

        this.setState({ allFamilies: newFamilyData });
    }
    parseStoreData() {
        const stores = this.state.allStores;

        const newStoreData = {};
        for (let key in stores) {
            let thisStoreName = stores[key]["address"];
            newStoreData[thisStoreName] = stores[key];
        }

        this.setState({ allStores: newStoreData });
    }
    parseTribeData() {
        const tribes = this.state.allTribes;
        const newTribeName = {};
        for (let key in tribes) {
            //this is how we'll adjust if the schema changes
            //newUserData[users[key][username]] = users[key][username];
            let thisTribeName = tribes[key]["tribeName"];
            newTribeName[thisTribeName] = tribes[key];
        }

        this.setState({ allTribes: newTribeName });
    }

    /*
    Recieves the item that needs to be displayed from AdminResults and displays it.
    */

    showOnPanel(selectedItem, displayType) {
        if (displayType === "family") {
            const family = this.state.allFamilies[selectedItem];
            this.setState({
                selectedItem: selectedItem,
                displayType: "family",
                selectedObj: family,
            });
        } else if (displayType === "user") {
            const user = this.state.allUsers[selectedItem];

            this.setState({
                selectedItem: selectedItem,
                displayType: "user",
                selectedObj: user,
            });
        } else if (displayType === "store") {
            const store = this.state.allStores[selectedItem];
            this.setState({
                selectedItem: selectedItem,
                displayType: "store",
                selectedObj: store,
            });
        } else if (displayType === "tribe") {
            const tribe = this.state.allTribes[selectedItem];
            this.setState({
                selectedItem: selectedItem,
                displayType: "tribe",
                selectedObj: tribe,
            });
        }
    }
    /* 
    Goes into the selected list and removes the instance. Updates the state with the new list. This function
    will call the server to handover the new update.
    */
    async deleteObj(selectedItem, displayType) {
        if (displayType === "user") {
            try {
                const response = await fetch("/users", {
                    method: "DELETE",
                    crossDomain: true,
                    credentials: "include",
                    redirect: "follow",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    referrerPolicy: "no-referrer",
                    body: JSON.stringify({
                        userID: this.state.selectedObj["_id"],
                    }),
                });

                if (response.status < 400) {
                    alert("Deleted!");
                }
            } catch (err) {
                console.log(err);
            }

            this.setState({
                selectedItem: "",
                selectedObj: [],
            });
        } else if (displayType === "family") {
            try {
                const response = await fetch("/family", {
                    method: "DELETE",
                    crossDomain: true,
                    credentials: "include",
                    redirect: "follow",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    referrerPolicy: "no-referrer",
                    body: JSON.stringify({
                        familyID: this.state.selectedObj["_id"],
                    }),
                });

                if (response.status < 400) {
                    alert("Deleted!");
                }
            } catch (err) {
                console.log(err);
            }

            this.setState({
                selectedItem: "",
                selectedObj: [],
            });
        } else if (displayType === "store") {
            try {
                const response = await fetch("/MapList", {
                    method: "DELETE",
                    crossDomain: true,
                    credentials: "include",
                    redirect: "follow",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    referrerPolicy: "no-referrer",
                    body: JSON.stringify({
                        storeID: this.state.selectedObj["_id"],
                    }),
                });

                if (response.status < 400) {
                    alert("Deleted!");
                }
            } catch (err) {
                console.log(err);
            }
            this.setState({
                selectedItem: "",
                selectedObj: [],
            });
        } else if (displayType === "tribe") {
            try {
                const response = await fetch("/tribe", {
                    method: "DELETE",
                    crossDomain: true,
                    credentials: "include",
                    redirect: "follow",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    referrerPolicy: "no-referrer",
                    body: JSON.stringify({
                        tribeID: this.state.selectedObj["_id"],
                    }),
                });

                if (response.status < 400) {
                    alert("Deleted!");
                }
            } catch (err) {
                console.log(err);
            }

            this.setState({
                selectedItem: "",
                selectedObj: [],
            });
        } else {
            alert("Something went wrong");
        }
        await this.getAllData();
    }
    /* 
    Simply gets a new list and then updates the state. This function
    will call the server to handover the new update.
    */
    addNewData(newData, dataType) {
        if (dataType === "family") {
            this.setState({ allFamilies: newData });
        } else if (dataType === "user") {
            this.setState({ allUsers: newData });
        } else if (dataType === "store") {
            this.setState({ allStores: newData });
        } else if (dataType === "tribe") {
            this.setState({ allTribes: newData });
        }
    }

    async getAllData() {
        try {
            //Getting all users
            const response = await fetch(`/all`, {
                method: "GET",
                crossDomain: true,
                credentials: "include",
                redirect: "follow",
                headers: {
                    "Content-Type": "application/json",
                },
                referrerPolicy: "no-referrer",
            });
            if (response.status < 400) {
                const allUsers = await response.json();
                this.setState({ allUsers });
                this.parseUserData();
            }
        } catch (err) {
            console.log(err);
        }
        try {
            //Getting all Stores
            const response = await fetch(`/MapList`, {
                method: "GET",
                crossDomain: true,
                credentials: "include",
                redirect: "follow",
                headers: {
                    "Content-Type": "application/json",
                },
                referrerPolicy: "no-referrer",
            });
            if (response.status < 500) {
                const allStores = await response.json();
                this.setState({ allStores: allStores.groceries });
                this.parseStoreData();
            }
        } catch (err) {
            console.log(err);
        }
        try {
            //Getting all families
            const response = await fetch(`/all/family`, {
                method: "GET",
                crossDomain: true,
                credentials: "include",
                redirect: "follow",
                headers: {
                    "Content-Type": "application/json",
                },
                referrerPolicy: "no-referrer",
            });
            if (response.status < 400) {
                const allFamilies = await response.json();
                this.setState({ allFamilies });
                this.parseFamilyData();
            }
        } catch (err) {
            console.log(err);
        }

        try {
            //Getting all users
            const response = await fetch(`/all/tribe`, {
                method: "GET",
                crossDomain: true,
                credentials: "include",
                redirect: "follow",
                headers: {
                    "Content-Type": "application/json",
                },
                referrerPolicy: "no-referrer",
            });
            if (response.status < 400) {
                const allTribes = await response.json();
                this.setState({ allTribes });
                this.parseTribeData();
            }
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        const adminSettings = (
            <div className="container-lg">
                <div className="row">
                    <div className="col-sm search">
                        <AdminSearch
                            allUsers={this.state.allUsers}
                            allFamilies={this.state.allFamilies}
                            allStores={this.state.allStores}
                            allTribes={this.state.allTribes}
                            showPanel={this.showOnPanel}
                            getAllData={this.getAllData}
                        />
                    </div>
                    <div className="col-sm data">
                        <AdminData
                            allUsers={this.state.allUsers}
                            allFamilies={this.state.allFamilies}
                            allStores={this.state.allStores}
                            allTribes={this.state.allTribes}
                            addNewData={this.addNewData}
                            getAllData={this.getAllData}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm panel">
                        <AdminPanel
                            selectedItem={this.state.selectedItem}
                            selectedObj={this.state.selectedObj}
                            displayType={this.state.displayType}
                            deleteObj={this.deleteObj}
                            getAllData={this.getAllData}
                        />
                    </div>
                </div>
            </div>
        );
        return (
            <div>{this.props.isAdmin ? adminSettings : <Unauthorized />}</div>
        );
    }
}
