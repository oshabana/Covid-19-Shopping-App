/*
This page is the main page for this feature. Everything in GroceryList is called from within here 
or a child. This will be the only coomponent in this feature to call the database as it is the first and last in
the collection of data thus it is the most accurate.
*/
import React, { Component } from "react";
import "./grocery-list.css";
import GroceryListForm from "./GroceryListForm/grocery-list-form.component";
import GroceryItem from "./GroceryItem/grocery-item.component";
import GroceryListTab from "./GroceryListTab/grocery-list-tab.component";
import SigninError from "../Errors/SigninError";
import FamilyError from "../Errors/FamilyError";
import { v4 as uuidv4 } from "uuid";

export default class GroceryList extends Component {
    constructor(props) {
        super(props);

        // This data will all be pulled from a server

        this.state = {
            //make sure data is this format {list1: {obj1: quantity, obj2: quantity}, list2:...}
            familyLists: {},
            currentList: "No list selected",
            yourFamily: null,
            alphabeticallyOrdered: false,
            listEditMode: false,
            isLoaded: false,
        };
        this.addItem = this.addItem.bind(this);
        this.renderCurrentList = this.renderCurrentList.bind(this);
        this.editItem = this.editItem.bind(this);
        this.changeAlphabeticalOrdering = this.changeAlphabeticalOrdering.bind(
            this
        );
        this.deleteItem = this.deleteItem.bind(this);
        this.updateState = this.updateState.bind(this);
        this.deleteList = this.deleteList.bind(this);
        this.isValidUser = this.isValidUser.bind(this);
        this.getLists = this.getLists.bind(this);
        this.getFamily = this.getFamily.bind(this);
    }

    /* 
        After render() is performed get the family and the all its lists.
    */
    async componentDidMount() {
        await this.getFamily();
        await this.getLists();
    }
    /*
        To be used only if user is in a family. This will pull all the lists of that given family 
        from the DB.
    */
    async getLists() {
        const user = this.props.user;
        if (user !== null && user.familyID) {
            try {
                const response = await fetch(`/list/${user.familyID}`, {
                    method: "GET",
                    crossDomain: true,
                    credentials: "include",
                    redirect: "follow",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    referrerPolicy: "no-referrer",
                });
                const groceryLists = await response.json();
                let updatedList = {};

                groceryLists.forEach((list) => {
                    updatedList[list.listname] = list.items;
                });

                await this.setState({ familyLists: updatedList });
                const intialList = Object.keys(this.state.familyLists);

                if (intialList.length > 0) {
                    this.setState({
                        currentList: intialList[0],
                        isLoaded: true,
                    });
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
    /*
        If the user exists and the user is in a family getFamily() 
        pulls the family from the DB for later use
    */
    async getFamily() {
        const user = this.props.user;
        if (user && user.familyID) {
            //Get family
            try {
                const response = await fetch(`/family`, {
                    method: "GET",
                    crossDomain: true,
                    credentials: "include",
                    redirect: "follow",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    referrerPolicy: "no-referrer",
                });
                const yourFamily = await response.json();
                if (yourFamily) {
                    this.setState({ yourFamily });
                } else {
                    console.log("Failed to get family");
                }
            } catch (err) {
                console.log(err, "Failed to get family");
            }
        }
    }

    updateState(updateObj) {
        this.setState(updateObj);
    }

    /*
        Later on this will call the server to hand over the new set of lists and items.
    */
    async editItem(item) {
        const currentList = this.state.currentList;
        /* 
        let updatedList = this.state.familyLists;
        delete updatedList[currentList][item.prevItemName];
        updatedList[currentList][item.name] = item.quantity;
        this.setState((state) => updatedList);
        */
        try {
            await fetch("/item", {
                method: "PATCH",
                crossDomain: true,
                credentials: "include",
                redirect: "follow",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    listname: currentList,
                    fid: this.props.user.familyID,
                    prevName: item.prevItemName,
                    newName: item.name,
                    quantity: item.quantity,
                }),
                referrerPolicy: "no-referrer",
            });
        } catch (err) {
            console.log(err);
        }
        await this.getLists();
        this.setState({ currentList });
    }

    /*
        Requests the DB to remove an item from a list. We then pull the uopdates.
    */
    async deleteItem(itemName) {
        const currentList = this.state.currentList;
        let updatedList = this.state.familyLists;
        try {
            await fetch("/item", {
                method: "DELETE",
                crossDomain: true,
                credentials: "include",
                redirect: "follow",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    listname: currentList,
                    fid: this.props.user.familyID,
                    itemname: itemName,
                }),
                referrerPolicy: "no-referrer",
            });
            delete updatedList[currentList][itemName];
            this.setState({ familLists: updatedList });
        } catch (err) {
            console.log(err);
        }
        await this.getLists();
        this.setState({ currentList });
    }
    /*
        Validates the items name and then sends the db a request for a change. 
        Pulls the new lists after.
    */
    async addItem(newItem) {
        const currentList = this.state.currentList;

        if (newItem.newItem.trim() === "") {
            alert("Please enter a valid name");
            return;
        }
        if (this.state.currentList === "No list selected") {
            alert(
                "Please add a list using the right hand menu. Enter a name and then hit the orange + button to create it. Once created, you can add items to your new list."
            );
            return;
        }
        try {
            await fetch("/item", {
                method: "POST",
                crossDomain: true,
                credentials: "include",
                redirect: "follow",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    listname: currentList,
                    fid: this.props.user.familyID,
                    itemname: newItem.newItem.trim(),
                    quantity: newItem.newItemQuantity,
                }),
                referrerPolicy: "no-referrer",
            });
            if (currentList !== "No list selected") {
                const updatedList = this.state.familyLists;
                updatedList[currentList][newItem.newItem] =
                    newItem.newItemQuantity;
                this.setState({ familyLists: updatedList });
            } else {
                alert("Please make/select a list before inserting an item.");
            }
        } catch (err) {
            console.log(err);
        }
        await this.getLists();
        this.setState({ currentList });
    }

    /*
        Calls the GroceryItem component to generate a tab with all the information given for each item on 
        the currently selected list.
    */
    renderCurrentList() {
        const currentList = this.state.currentList;
        if (currentList !== "No list selected") {
            const listObject = this.state.familyLists[currentList];
            const order = this.state.alphabeticallyOrdered;
            if (listObject !== undefined) {
                const listKeys = !order
                    ? Object.keys(listObject).sort()
                    : Object.keys(listObject).sort().reverse();
                return listKeys.map((key) => (
                    <GroceryItem
                        key={uuidv4()}
                        name={key}
                        editable={true}
                        quantity={listObject[key]}
                        editItem={this.editItem}
                        deleteItem={this.deleteItem}
                    />
                ));
            }
        }
    }
    /* 
        The function that allows the buttons on the list view panel to switch the current working list.
    */

    changeAlphabeticalOrdering(e) {
        e.checked === true ? (e.checked = false) : (e.checked = true);
        this.setState({
            alphabeticallyOrdered: !this.state.alphabeticallyOrdered,
        });
    }
    /*
        Similar to deleteItem()
    */
    async deleteList() {
        /*
        let updatedList = this.state.familyLists;
        delete updatedList[oldList];
        */
        await fetch("/list", {
            method: "DELETE",
            crossDomain: true,
            credentials: "include",
            redirect: "follow",
            headers: {
                "Content-Type": "application/json",
            },
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
                listname: this.state.currentList,
                fid: this.props.user.familyID,
            }),
        });

        await this.getLists();
        this.setState({ currentList: "No list selected" });
    }
    /*
        Blocks people who are not signed in or are not part of a family
    */
    isValidUser(content) {
        if (this.props.user === null) return <SigninError />;
        if (this.props.user.familyID === null) return <FamilyError />;
        return content;
    }

    render() {
        const userInfo = (
            <div>
                <h6>
                    {this.props.user ? `Hello, ${this.props.user.name}` : ""}{" "}
                </h6>
                <h6>
                    {this.state.yourFamily
                        ? `You are part of ${this.state.yourFamily.familyName}`
                        : ""}
                </h6>
            </div>
        );

        const listDeleteButton = (
            <button
                className="GroceryList-list-btn btn btn-secondary btn-delete"
                onClick={this.deleteList}
            >
                Delete
            </button>
        );
        const loggedInData = (
            <div className="row">
                <div className="GroceryList-currentList col-lg-">
                    {this.props.user ? userInfo : ""}
                    <h4 className="GroceryList-list-title">
                        {this.state.currentList}
                    </h4>
                    {this.state.currentList === "No list selected"
                        ? ""
                        : listDeleteButton}
                    {this.state.currentList !== "No list selected"
                        ? this.renderCurrentList()
                        : ""}
                    <GroceryListForm addItem={this.addItem} />
                    <br></br>
                </div>
                <GroceryListTab
                    familyLists={this.state.familyLists}
                    updateState={this.updateState}
                    currentList={this.state.currentList}
                    alphabeticallyOrdered={this.state.alphabeticallyOrdered}
                    user={this.props.user}
                />
            </div>
        );
        return (
            <div className="GroceryList container">
                {this.isValidUser(loggedInData)}
            </div>
        );
    }
}
