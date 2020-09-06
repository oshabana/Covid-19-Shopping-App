const mongoose = require("mongoose");

const time = new mongoose.Schema({
    date: Date,
    time: Number,
});

const MapListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
    },
    address: {
        type: String,
        required: true,
    },
    open: {
        type: String,
        required: true,
    },
    timesubmitted: [time],
 

    wait: {
        type: String,
        required: true,
    },
    coordinates: [
        { type: Number, required: true },
        { type: Number, required: true },
    ],
});

const MapList = mongoose.model("MapList", MapListSchema);

module.exports = { MapList };
