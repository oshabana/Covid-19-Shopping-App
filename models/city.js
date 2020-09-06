const mongoose = require("mongoose");

const City = mongoose.model("City", {
    name: { type: String, required: true },
    coordinate: [
        { type: Number, required: true },
        { type: Number, required: true },
    ],
});

module.exports = { City };
