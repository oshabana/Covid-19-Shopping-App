import React, { Component } from "react";
import "./tribe.css";
import FamilyMember from "./FamilyMember/family-member.component";
import { inviteFamily, inviteTribe } from "../../actions/tribe";
import SigninError from "../Errors/SigninError";
import FamilyError from "../Errors/FamilyError";

import { v4 as uuidv4 } from "uuid";

export default class Tribe extends Component {
    constructor(props) {
        super(props);

        // This data will all be pulled from a server
        this.state = {
            users: [],
            tribeList: {},
            currentFamily: "",
            currentTribe: "",
            invitedUser: "",
            invitedFamily: "",
        };

        this.renderLists = this.renderLists.bind(this);
        this.renderCurrentList = this.renderCurrentList.bind(this);
        this.selectList = this.selectList.bind(this);
        this.inviteJoinFamily = this.inviteJoinFamily.bind(this);
        this.handleChangeinvitedUser = this.handleChangeinvitedUser.bind(this);
        this.inviteJoinTribe = this.inviteJoinTribe.bind(this);
        this.handleChangeinvitedFamily = this.handleChangeinvitedFamily.bind(
            this
        );
        this.showLists = this.showLists.bind(this);
        this.isValidUser = this.isValidUser.bind(this);
    }

    async componentDidMount() {
        try {
            const response = await fetch("/users", {
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
                const user = await response.json();
                if (!user) {
                    return;
                }
                this.setState({ user });
            }
        } catch (err) {
            console.log(err);
        }

        try {
            if (!this.state.user) {
                return;
            }
            if (!this.state.user.familyID) {
            } else {
                const fid = this.state.user.familyID;
                const url = `/family/users/${fid}`;
                const request = new Request(url, {
                    method: "GET",
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json",
                    },
                });
                const response = await fetch(request, {});
                const json = await response.json();
                const users = await json.users;
                const familyName = await json.familyName;

                const names = [];

                users.map((user) => {
                    names.push(user.name);
                });

                this.setState({ users: names, currentFamily: familyName });
            }

            if (!this.state.user) {
                return;
            }
            if (!this.state.user.familyID) {
            } else {
                const fid = this.state.user.familyID;
                const url = `/family/${fid}`;
                const request = new Request(url, {
                    method: "GET",
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json",
                    },
                });
                const response = await fetch(request, {});
                const json = await response.json();
                const tribeID = await json.tribes;
                const tribes = {};

                tribeID.map(async (tid) => {
                    const url = `/tribe/families/${tid}`;
                    const request = new Request(url, {
                        method: "GET",
                        headers: {
                            Accept: "application/json, text/plain, */*",
                            "Content-Type": "application/json",
                        },
                    });
                    const response = await fetch(request, {});
                    const json = await response.json();
                    const tribeName = await json.tribeName;
                    const familyArray = await json.family;
                    const familyNames = [];

                    familyArray.map((family) => {
                        familyNames.push(family.familyName);
                    });

                    const tribeObj = {
                        [tribeName]: familyNames,
                    };

                    const returned = Object.assign(tribes, tribeObj);
                    this.setState({
                        tribeList: returned,
                        currentTribe: tribeName,
                    });
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    // Lists the members of the currently selected family
    //Will require server call to get names of family members
    renderCurrentList() {
        const listObject = this.state.users;
        const listKeys = Object.keys(listObject).sort();

        return listKeys.map((key) => (
            <FamilyMember key={uuidv4()} name={listObject[key]} />
        ));
    }

    // creates the list of Tribes and which families they contain
    //Will require server call to get the tribes and whic hfamilies they contain
    renderLists() {
        const tribeList = this.state.tribeList;
        const currentFamily = this.state.currentFamily;
        const lists = Object.keys(tribeList);
        let newLists = Object.keys(tribeList);

        for (let i = 0; i < lists.length; i++) {
            let inList = false;

            for (let j = 0; j < tribeList[lists[i]].length; j++) {
                if (currentFamily === tribeList[lists[i]][j]) {
                    inList = true;
                }
            }

            if (!inList) {
                let idx = newLists.indexOf(lists[i]);
                newLists.splice(idx, 1);
            }
        }

        return newLists.map((list) => (
            <div key={uuidv4()}>
                <button
                    name={list}
                    onClick={() => this.selectList(list)}
                    className="TribeList-list-change-btn"
                >
                    {list}
                </button>
                <ul>{this.makeList(tribeList[list])}</ul>
            </div>
        ));
    }

    /* This function sends the name of the tribe button that was pushed to the 
  grocery list page in order to display the correct lists based on which tribe
  was selected */
    selectList(tribe) {
        this.setState({ currentTribe: tribe });
    }

    async showLists() {
        const list = document.querySelector("#groceries");
        const header = document.createElement("h4");
        const headerText = document.createTextNode(
            `${this.state.currentTribe}'s Grocery Lists`
        );

        // empty div
        while (list.firstChild) list.removeChild(list.firstChild);

        // add header
        header.appendChild(headerText);
        list.appendChild(header);

        // get lists
        try {
            if (!this.state.user) {
                return;
            }
            if (!this.state.user.familyID) {
            } else {
                const tName = this.state.currentTribe;
                const url = `/tribe/lists/${tName}`;
                const request = new Request(url, {
                    method: "GET",
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json",
                    },
                });
                const response = await fetch(request, {});
                const json = await response.json();

                json.map(async (family) => {
                    const familyHeader = document.createElement("h5");
                    const familyHeaderText = document.createTextNode(
                        `${family.familyName}`
                    );

                    familyHeader.appendChild(familyHeaderText);

                    const fid = family._id;
                    const url = `/list/${fid}`;
                    const request = new Request(url, {
                        method: "GET",
                        headers: {
                            Accept: "application/json, text/plain, */*",
                            "Content-Type": "application/json",
                        },
                    });
                    const response = await fetch(request, {});
                    const json = await response.json();
                    list.appendChild(familyHeader);

                    json.map((grocList) => {
                        const entries = Object.entries(grocList.items);
                        const listNode = document.createElement("ul");

                        entries.map(async (thing) => {
                            const itemNode = document.createElement("li");
                            const itemNodeText = document.createTextNode(
                                `${thing[0]} ${thing[1]}`
                            );

                            itemNode.appendChild(itemNodeText);
                            listNode.appendChild(itemNode);
                        });
                        list.appendChild(listNode);
                    });
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    inviteJoinFamily(e) {
        e.preventDefault();
        inviteFamily(this.state.invitedUser);
        this.setState({ invitedUser: "" });
    }

    handleChangeinvitedUser(e) {
        e.preventDefault();
        const uName = e.target.value;
        this.setState({ invitedUser: uName });
    }

    inviteJoinTribe(e) {
        e.preventDefault();
        inviteTribe(this.state.invitedFamily, this.state.currentTribe);
        this.setState({ invitedUser: "" });
    }

    handleChangeinvitedFamily(e) {
        e.preventDefault();
        const fName = e.target.value;
        this.setState({ invitedFamily: fName });
    }
    isValidUser(content) {
        if (this.props.user === null) return <SigninError />;
        if (this.props.user.familyID === null) return <FamilyError />;
        return content;
    }

    // Helper function, creates the list of families in each tribe
    // Will require server call
    makeList(listObject) {
        const listKeys = Object.keys(listObject).sort();
        return listKeys.map((key) => (
            <li key={uuidv4()}>
                <FamilyMember key={uuidv4()} name={listObject[key]} />
            </li>
        ));
    }

    render() {
        const tribeHtml = (
            <div>
                <div className="row">
                    <div className="Family-list col-lg">
                        <h3>Family: {this.state.currentFamily}</h3>
                        {this.renderCurrentList()}
                        <br />
                        <br />
                        <form
                            className="bottomForm"
                            onSubmit={this.inviteJoinFamily}
                        >
                            <input
                                type="name"
                                name="username"
                                placeholder="Username"
                                value={this.state.invitedUser}
                                onChange={this.handleChangeinvitedUser}
                                required
                            />
                            <button
                                className="buttonsubmit btn btn-primary btn-add-tribe"
                                type="submit"
                            >
                                Invite To Family
                            </button>
                        </form>
                    </div>
                    <div className="Tribe-list col-sm">
                        <h3>Selected Tribe: {this.state.currentTribe}</h3>
                        {this.renderLists()}
                        <br />
                        <br />
                        <form
                            className="bottomForm"
                            onSubmit={this.inviteJoinTribe}
                        >
                            <input
                                type="name"
                                name="username"
                                placeholder="Username"
                                value={this.state.invitedFamily}
                                onChange={this.handleChangeinvitedFamily}
                                required
                            />
                            <button
                                className="buttonsubmit btn btn-primary btn-add-tribe"
                                type="submit"
                            >
                                Invite To Tribe
                            </button>
                        </form>
                    </div>
                </div>
                <br />
                <br />
                <button
                    className="btn btn-primary btn-showList"
                    onClick={this.showLists}
                >
                    Show Lists for Current Tribe
                </button>
                <div className="FamilyTribe container col-lg">
                    <div id="groceries">
                        <h4>Tribe Members Grocery Lists</h4>
                    </div>
                </div>
            </div>
        );
        return (
            <div className="FamilyTribe container">
                {this.isValidUser(tribeHtml)}
            </div>
        );
    }
}
