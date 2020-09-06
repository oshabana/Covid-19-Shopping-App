import React, { Component } from "react";
import "./grocery-item.css";

export default class GroceryItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: this.props.name,
            quantity: this.props.quantity,
            editable: this.props.editable,
            editMode: false,
        };
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.changeEditMode = this.changeEditMode.bind(this);
    }
    changeEditMode() {
        this.setState({ editMode: !this.state.editMode });
    }

    handleEdit(e) {
        e.preventDefault();
        const newItem = {
            prevItemName: this.props.name,
            name: this.state.name,
            quantity: Number(this.state.quantity),
        };
        this.props.editItem(newItem);
        this.setState({ editMode: !this.state.editMode });
    }

    handleDelete(e) {
        this.props.deleteItem(this.props.name);
    }

    onInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    render() {
        let editBox = (
            <div className="GroceryItem-info">
                <form onSubmit={this.handleEdit}>
                    <input
                        className="GroceryItem-input"
                        name="name"
                        type="text"
                        value={this.state.name}
                        onChange={this.onInputChange}
                    />

                    <input
                        className="GroceryItem-input"
                        name="quantity"
                        type="number"
                        value={this.state.quantity}
                        onChange={this.onInputChange}
                    />
                    <button className="GroceryItem-buttons btn btn-primary">
                        Save
                    </button>
                </form>
            </div>
        );
        let infoBox = (
            <div className="GroceryItem-info">
                <p className="GroceryItem-info">{this.state.name}</p>
                <p className="GroceryItem-info">{this.state.quantity}</p>
            </div>
        );

        return (
            <div className="GroceryItem container">
                {this.state.editMode ? editBox : infoBox}
                {!this.state.editable || this.state.editMode ? (
                    ""
                ) : (
                    <div className="GroceryItem-buttons-container">
                        <button
                            className="GroceryItem-buttons btn btn-secondary btn-edit"
                            onClick={this.changeEditMode}
                        >
                            Edit
                        </button>
                        <button
                            type="button"
                            className="GroceryItem-buttons btn btn-secondary btn-delete"
                            onClick={this.handleDelete}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        );
    }
}
