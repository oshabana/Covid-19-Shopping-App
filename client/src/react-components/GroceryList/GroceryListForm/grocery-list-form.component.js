import React, { Component } from "react";
import "./grocery-list-form.css";

class GroceryListForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newItem: "",
            newItemQuantity: 1,
        };
        this.onInputChange = this.onInputChange.bind(this);
        this.sendItem = this.sendItem.bind(this);

        this.addItem = this.props.addItem;
    }

    onInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    // Calls the parent to add the item to the DB
    sendItem(e) {
        e.preventDefault();
        this.addItem(this.state);
        this.setState({ newItem: "", newItemQuantity: 1 });
    }

    render() {
        return (
            <div className="GroceryListForm-order">
                <form onSubmit={this.sendItem}>
                    <label htmlFor="item">Item Name</label>
                    <input
                        className="GroceryListForm-item-input"
                        name="newItem"
                        type="text"
                        value={this.state.newItem}
                        onChange={this.onInputChange}
                    />

                    <label htmlFor="quantity">Quantity</label>
                    <input
                        className="GroceryListForm-quantity-input"
                        name="newItemQuantity"
                        type="number"
                        min={1}
                        value={this.state.newItemQuantity}
                        onChange={this.onInputChange}
                    />
                    <button className="GroceryListForm-add">Add</button>
                </form>
            </div>
        );
    }
}

export default GroceryListForm;
