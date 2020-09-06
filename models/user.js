/* User mongoose model */
"use strict";

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { resolve } = require("path");
const { ObjectID } = require("mongodb");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: "Not valid email",
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
    },
    name: {
        type: String,
        required: true,
        minlength: 1,
    },
    familyID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Family",
        default: null
    },
    pending: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Family",
        default: undefined
    },
    admin: {
        type: Boolean,
        required: true,
        default: false,
    },
    familyAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    tribeAdmin: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Tribe",
        required: true
    },
    created: {
        type: Date,
        required: true,
        default: Date.now(),
    },
});

UserSchema.pre("save", function (next) {
    const user = this;

    if (user.isModified("password")) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

UserSchema.statics.findByUsernamePassword = function (username, password) {
    const User = this;

    return User.findOne({ username: username }).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};

const User = mongoose.model("User", UserSchema);
module.exports = { User };
