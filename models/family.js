/* Family mongoose model */
const mongoose = require("mongoose");
const time = new mongoose.Schema({
    date: Date,
    StoreId: mongoose.Schema.Types.ObjectId,
    timesubmitted: Number,
    userId: mongoose.Schema.Types.ObjectId,
});

const Family = mongoose.model("Family", {
    familyName: {
        type: String,
        required: true,
        minlength: 1,
    },
    tribes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Tribe",
        required: true,
    },
    offers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        required: true,
    },
    pending: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Tribe",
        required: true,
    },
    time:[time]

    
});

module.exports = { Family };
