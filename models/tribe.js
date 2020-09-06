/* Family mongoose model */
const mongoose = require('mongoose');

const Tribe = mongoose.model('Tribe', {
    tribeName: {
        type: String,
         required: true,
         minlength:1,
         unique: true
    },
    offers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Family",
        required: true
    }
});

module.exports = { Tribe }