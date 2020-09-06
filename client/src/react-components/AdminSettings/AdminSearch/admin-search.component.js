import React, { Component } from "react";
import "./admin-search.css";
import AdminResults from "../AdminResults/admin-results.component";

export default class AdminSearch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userName: "",
            familyName: "",
            storeName: "",
            tribeName: "",
            searchType: "user",
            allUsers: {},
            allFamilies: {},
            allStores: {},
            allTribes: {},
            autoSuggestList: [],
        };
        this.showPanel = this.showPanel.bind(this);

        this.userMode = this.userMode.bind(this);
        this.familyMode = this.familyMode.bind(this);
        this.storeMode = this.storeMode.bind(this);
        this.tribeMode = this.tribeMode.bind(this);

        this.autoSuggestUser = this.autoSuggestUser.bind(this);
        this.autoSuggestFamily = this.autoSuggestFamily.bind(this);
        this.autoSuggestStore = this.autoSuggestStore.bind(this);
        this.autoSuggestTribe = this.autoSuggestTribe.bind(this);
    }
    componentDidUpdate(prevProps, newState) {
        if (
            prevProps.allTribes !== this.props.allTribes ||
            prevProps.allFamilies !== this.props.allFamilies ||
            prevProps.allStores !== this.props.allStores ||
            prevProps.allUsers !== this.props.allUsers
        ) {
            this.setState({
                allUsers: this.props.allUsers,
                allFamilies: this.props.allFamilies,
                allStores: this.props.allStores,
                allTribes: this.props.allTribes,
            });
        }
    }
    componentDidMount() {
        const allUsers = this.props.allUsers;
        const allFamilies = this.props.allFamilies;
        const allStores = this.props.allStores;
        const allTribes = this.props.allTribes;
        this.userMode();
        this.setState({
            searchType: "user",
            allUsers,
            allFamilies,
            allStores,
            allTribes,
        });
    }
    /* 
    This is a middle man function that passes the results up to settings (which is the main page for this feature).
    */
    showPanel(selectedItem, searchType) {
        this.props.showPanel(selectedItem, searchType);
    }
    userMode() {
        this.setState({
            searchType: "user",
            autoSuggestList: Object.keys(this.state.allUsers).sort(),
        });
    }
    familyMode() {
        this.setState({
            searchType: "family",
            autoSuggestList: Object.keys(this.state.allFamilies).sort(),
        });
    }
    storeMode() {
        this.setState({
            searchType: "store",
            autoSuggestList: Object.keys(this.state.allStores).sort(),
        });
    }
    tribeMode() {
        this.setState({
            searchType: "tribe",
            autoSuggestList: Object.keys(this.state.allTribes).sort(),
        });
    }
    autoSuggestUser(e) {
        this.setState({ [e.target.name]: e.target.value });
        const list = this.state.allUsers;
        const currentText = e.target.value.toLowerCase();
        const matches = Object.keys(list).filter(
            (listItem) =>
                currentText ===
                listItem.toLowerCase().substring(0, currentText.length)
        );
        this.setState({ autoSuggestList: matches.sort() });
    }
    autoSuggestFamily(e) {
        this.setState({ [e.target.name]: e.target.value });
        const list = this.state.allFamilies;
        const currentText = e.target.value.toLowerCase();
        const matches = Object.keys(list).filter(
            (listItem) =>
                currentText ===
                listItem.toLowerCase().substring(0, currentText.length)
        );
        this.setState({ autoSuggestList: matches.sort() });
    }

    autoSuggestStore(e) {
        this.setState({ [e.target.name]: e.target.value });
        const list = this.state.allStores;
        const currentText = e.target.value.toLowerCase();
        const matches = Object.keys(list).filter(
            (listItem) =>
                currentText ===
                listItem.toLowerCase().substring(0, currentText.length)
        );

        this.setState({ autoSuggestList: matches.sort() });
    }

    autoSuggestTribe(e) {
        this.setState({ [e.target.name]: e.target.value });
        const list = this.state.allTribes;
        const currentText = e.target.value.toLowerCase();
        const matches = Object.keys(list).filter(
            (listItem) =>
                currentText ===
                listItem.toLowerCase().substring(0, currentText.length)
        );

        this.setState({ autoSuggestList: matches.sort() });
    }

    render() {
        const familySearch = (
            <div>
                <AdminResults
                    searchableObject={this.state.allFamilies}
                    searchType="family"
                    showPanel={this.showPanel}
                    getAllData={this.state.getAllData}
                />
            </div>
        );
        const userSearch = (
            <div>
                <AdminResults
                    searchableObject={this.state.allUsers}
                    searchType="user"
                    showPanel={this.showPanel}
                    getAllData={this.props.getAllData}
                />
            </div>
        );

        const storeSearch = (
            <div>
                <AdminResults
                    searchableObject={this.state.allStores}
                    searchType="store"
                    showPanel={this.showPanel}
                    getAllData={this.props.getAllData}
                />
            </div>
        );

        const tribeSearch = (
            <div>
                <AdminResults
                    searchableObject={this.state.allTribes}
                    showPanel={this.showPanel}
                    searchType="tribe"
                    getAllData={this.props.getAllData}
                />
            </div>
        );

        return (
            <div className="AdminSearch">
                <h6 className="AdminSearch-title">Search for </h6>
                <div className="btn-group" role="group">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={this.userMode}
                    >
                        Users
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

                {this.state.searchType === "family" ? familySearch : ""}
                {this.state.searchType === "user" ? userSearch : ""}
                {this.state.searchType === "store" ? storeSearch : ""}
                {this.state.searchType === "tribe" ? tribeSearch : ""}
            </div>
        );
    }
}
