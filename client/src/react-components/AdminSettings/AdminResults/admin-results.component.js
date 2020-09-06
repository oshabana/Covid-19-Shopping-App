import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";
import "./admin-results.css";

export default class AdminResults extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedItem: "Nothing is selected",
        };
        this.renderResults = this.renderResults.bind(this);
        this.selectResult = this.selectResult.bind(this);
    }

    selectResult(e) {
        this.props.showPanel(e.target.innerHTML, this.props.searchType);
    }
    /*
    Generates components for the list of obtained results
    */
    renderResults() {
        const list = Object.keys(this.props.searchableObject);
        return list.map((item) => (
            <h5
                className="AdminResults-results"
                key={uuidv4()}
                onClick={this.selectResult}
            >
                {item}
            </h5>
        ));
    }
    /*
        Here we pass the information up to the parent on what is being deleted.
    */
    deleteItem(selectedItem, displayType) {
        this.props.deleteItem(this.props.selectedItem, this.props.displayType);
    }

    render() {
        return (
            <div className="AdminResults-search">
                <br></br>
                <p className="AdminResults-instruction">Click to inspect</p>

                {this.renderResults()}
            </div>
        );
    }
}
