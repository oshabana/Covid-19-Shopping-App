"use strict";
const log = console.log;

const express = require("express");
const app = express();

const cors = require("cors");
//mongoose and mongo connection
const { mongoose } = require("./db/mongoose");
mongoose.set("useFindAndModify", false);

// import mongoose models
const { User } = require("./models/user");
const { Family } = require("./models/family");
const { List } = require("./models/list");
const { Tribe } = require("./models/tribe");
const { MapList } = require("./models/mapList");
const { City } = require("./models/city");
// to validate object IDs
const { ObjectID } = require("mongodb");

// body-parser middleware
const bodyParser = require("body-parser");
const datetime = require("date-and-time");
app.use(bodyParser.json());
app.use(cors());
// express-session for user sessions
const session = require("express-session");
app.use(bodyParser.urlencoded({ extended: true }));

/* Session Handling *** */

// Create session cookie
app.use(
    session({
        secret: "oursecret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 600000,
            httpOnly: true,
        },
    })
);

// Get all users - to be used by admin (verification performed)

// Login route sets currentUser
app.post("/users/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findByUsernamePassword(username, password)
        .then((user) => {
            req.session.user = user._id;
            req.session.email = user.email;
            res.status(200).send({
                currentUser: user.username,
                name: user.name,
                admin: user.admin,
                tribeAdmin: user.tribeAdmin,
                familyAdmin: user.familyAdmin,
                familyID: user.familyID,
                email: user.email,
            });
            req.session.save();
        })
        .catch((error) => {
            res.status(400).send();
        });
});

// Logout route destroys session cookie
app.get("/users/logout", (req, res) => {
    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }
    req.session.destroy((error) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.send();
        }
    });
});

// Checks the current user
app.get("/users/check-session", (req, res) => {
    if (req.session.user) {
        res.status(200).send(true);
    } else {
        res.status(200).send(false);
    }
});

// Create new user
app.post("/users", (req, res) => {
    const user = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
    });
    user.save()
        .then((user) => {
            res.send(user);
        })
        .catch((error) => {
            res.status(400).send(error.keyValue);
        });
});

app.delete("/users", (req, res) => {
    const currentUser = req.session.user;
    const userID = req.body.userID;
    User.findById(currentUser)
        .then((user) => {
            if (!user) {
                res.status(404).send("Insufficient privileges");
            } else if (user.admin) {
                User.findByIdAndDelete(userID)
                    .then(() => res.status(200).end())
                    .catch((err) => res.status(400).end());
            }
        })
        .catch((err) => res.status(500).end);
});

// Edit a user - to be used only by admins
app.patch("/users", (req, res) => {
    const currentUser = req.session.user;
    const userID = req.body.userID;
    const changes = req.body.change;
    User.findById(currentUser).then((user) => {
        if (!user) {
            res.status(404).send("Resource Not Found");
        } else if (user.admin) {
            User.findById(userID)
                .then((user) => {
                    user.updateOne({ [changes[0]]: changes[1] })
                        .then(() => res.status(200).end())
                        .catch((err) => res.status(400).end());
                })
                .catch(() => res.status(400).end());
        } else {
            res.status(404).send({
                error: "Not authorized to perform this function",
            });
        }
    });
});

/*
{
    email: ,
    password: ,
}
*/
app.post("/reset/:id", (req,res)=>{
    const currentUser = req.params.id;
        
      
          User.findOne({ _id: currentUser}).then((user) => {
            if (!user) {
                res.status(404).send();
             
            }
             user.email = req.body.email;
            user.password = req.body.password;
            user.save().then((result)=>{
                res.send(result)
            }).catch((error) => {
                if (isMongoError(error)) {
                    // check for if mongo server suddenly dissconnected before this request.
                    res.status(500).send("Internal server error");
                } else {
                    log(error); // log server error to the console, not to the client.
                    res.status(400).send("Bad Request"); // 400 for bad request gets sent to client.
                }
            });
        }) .catch(() => res.status(400).end());
        
    
   
})
// Returns current user
app.get("/users", (req, res) => {
    const currentUser = req.session.user;
    User.findById(currentUser).then((user) => {
        if (!user) {
            res.status(404).send("Insufficient privileges");
        } else {
            const data = {
                id: currentUser,
                admin: user.admin,
                tribeAdmin: user.tribeAdmin,
                email: user.email,
                familyID: user.familyID,
                name: user.name,
                familyAdmin: user.familyAdmin,
                username: user.username,
                pending: user.pending,
            };
            res.send(data);
        }
    });
});

app.get("/user/:uName", (req, res) => {
    const uName = req.params.uName;

    User.find({ username: uName }).then((user) => {
        if (!user) {
            res.status(404).send("No such user");
        } else {
            res.send(user);
        }
    });
});

// get your family
app.get("/family", (req, res) => {
    const currentUser = req.session.user;

    if (currentUser) {
        User.findById(currentUser)
            .then((user) => {
                const familyID = user.familyID;
                Family.findById(familyID)
                    .then((family) => {
                        res.status(200).send(family);
                    })
                    .catch((err) => res.status(400).send(err));
            })
            .catch((error) => res.status(404).send(error));
    } else {
        res.status(400).send("Invaid FamilyID");
    }
});

// Create a new family
app.post("/family", (req, res) => {
    const currentUser = req.session.user;
    const family = new Family({
        familyName: req.body.familyName,
    });

    family.save().then(
        (family) => {
            User.findById(currentUser).then((user) => {
                user.familyID = family._id;
                user.familyAdmin = true;

                user.save()
                    .then((result) => {
                        res.send({ user: result, family });
                    })
                    .catch((error) => {
                        res.status(400).send(error);
                    });
            });
        },
        (error) => {
            res.status(400).send(error);
        }
    );
});

app.delete("/family", (req, res) => {
    const familyID = req.body.familyID;

    Family.findByIdAndDelete(familyID)
        .then(() => res.status(200).end())
        .catch((err) => res.status(400).end());
});
//edit a family - to be used only by admins
app.patch("/family", (req, res) => {
    const currentUser = req.session.user;
    const familyID = req.body.familyID;
    const changes = req.body.change;
    User.findById(currentUser).then((user) => {
        if (!user) {
            res.status(404).send("Resource Not Found");
        } else if (user.admin) {
            Family.findById(familyID)
                .then((family) => {
                    family
                        .updateOne({ [changes[0]]: changes[1] })
                        .then(() => res.status(200).end())
                        .catch((err) => res.status(400).end());
                })
                .catch(() => res.status(400).end());
        } else {
            res.status(404).send({
                error: "Not authorized to perform this function",
            });
        }
    });
});
/*
["path": "/time", "value": [...]]
*/
app.patch("/family/:fid", (req, res) => {
    const id = req.params.fid;
    if (!ObjectID.isValid(id)) {
        res.status(404).send();
        return; // so that we don't run the rest of the handler.
    }

    // check mongoose connection established.
    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }

    // Find the fields to update and their values.
    const fieldsToUpdate = {};
    req.body.map((change) => {
        const propertyToChange = change.path.substr(1);
        // log(propertyToChange)
        fieldsToUpdate[propertyToChange] = change.value;
    });
    Family.findByIdAndUpdate(
        id,
        { $set: fieldsToUpdate },
        { new: true, useFindAndModify: false }
    ).then((result) => {
        if (!result) {
            res.status(404).send("Resource not found");
        } else {
            res.send(result);
        }
    });
});
// Returns all users in an array belonging to family fid
app.get("/family/:fid", (req, res) => {
    const fid = req.params.fid;

    if (!ObjectID.isValid(fid)) {
        res.status(404).send();
        return;
    }

    Family.findById(fid).then((family) => {
        res.send(family);
    });
});
/*
    {
        StoreId: ,
        date:  ,
        timesubmitted: ,
        userId: ,

    }
*/
app.post("/family/addtime/:fid", (req, res) => {
    const fid = req.params.fid;

    if (!ObjectID.isValid(fid)) {
        res.status(404).send();
        return;
    }
    const newtime = {
        date: new Date(),
        StoreId: req.body.StoreId,
        timesubmitted: req.body.timesubmitted,
        userId: req.body.userId,
    };

    Family.findById(fid)
        .then((family) => {
            family.time.push(newtime);
            family
                .save()
                .then((result) => {
                    res.send(result);
                })
                .catch((error) => {
                    if (isMongoError(error)) {
                        // check for if mongo server suddenly dissconnected before this request.
                        res.status(500).send("Internal server error");
                    } else {
                        log(error);
                        res.status(400).send("Bad Request"); // bad request for changing the student.
                    }
                });
        })
        .catch((error) => {
            if (isMongoError(error)) {
                // check for if mongo server suddenly dissconnected before this request.
                res.status(500).send("Internal server error");
            } else {
                log(error);
                res.status(400).send("Bad Request"); // bad request for changing the student.
            }
        });
});

// Returns all users in an array belonging to family fid
app.get("/family/users/:fid", (req, res) => {
    const fid = req.params.fid;

    if (!ObjectID.isValid(fid)) {
        res.status(404).send();
        return;
    }

    Family.findById(fid).then((family) => {
        User.find({ familyID: fid }).then((users) => {
            res.send({ users, familyName: family.familyName });
        });
    });
});

// Current user joins family fid
app.patch("/family/join/:fid", (req, res) => {
    const fid = req.params.fid;

    if (!ObjectID.isValid(fid)) {
        res.status(404).send();
        return;
    }

    Family.findById(fid).then((family) => {
        if (!family) {
            res.status(404).send("Resource not found");
        } else {
            const currentUser = req.session.user;

            User.findById(currentUser).then((user) => {
                log(user.pending, fid);
                if (user.pending == fid) {
                    user.familyID = fid;
                    user.pending = undefined;

                    user.save()
                        .then((result) => {
                            const index = family.offers.indexOf(user._id);
                            family.offers.splice(index, 1);
                            family.save();
                            res.send({ user: result, family });
                        })
                        .catch((error) => {
                            res.status(400).send(error);
                        });
                } else {
                    res.status(400).send("User not invited to Family");
                }
            });
        }
    });
});

// Current user declines invite to family fid
app.patch("/family/decline/:fid", (req, res) => {
    const fid = req.params.fid;

    if (!ObjectID.isValid(fid)) {
        res.status(404).send();
        return;
    }

    Family.findById(fid).then((family) => {
        if (!family) {
            res.status(404).send("Resource not found");
        } else {
            const currentUser = req.session.user;

            User.findById(currentUser).then((user) => {
                log(user.pending, fid);
                if (user.pending == fid) {
                    user.pending = undefined;

                    user.save()
                        .then((result) => {
                            const index = family.offers.indexOf(user._id);
                            family.offers.splice(index, 1);
                            family.save();
                            res.send({ user: result, family });
                        })
                        .catch((error) => {
                            res.status(400).send(error);
                        });
                } else {
                    res.status(400).send("User not invited to Family");
                }
            });
        }
    });
});

// Invite a user to join family
app.patch("/family/invite/:uid", (req, res) => {
    const uid = req.params.uid;

    if (!ObjectID.isValid(uid)) {
        res.status(404).send();
        return;
    }

    User.findById(uid).then((user) => {
        if (!user) {
            res.status(404).send("Resource not found");
        } else {
            const currentUser = req.session.user;

            User.findById(currentUser).then((adminUser) => {
                if (adminUser.familyAdmin === true) {
                    const currentFamily = adminUser.familyID;
                    Family.findById(currentFamily).then((family) => {
                        family.offers.push(uid);
                        user.pending = currentFamily;
                        user.save();

                        family
                            .save()
                            .then((result) => {
                                res.send({ family: result, user });
                            })
                            .catch((error) => {
                                res.status(400).send(error);
                            });
                    });
                } else {
                    res.status(400).send("Not an admin");
                }
            });
        }
    });
});

// Create a new tribe
app.post("/tribe", (req, res) => {
    const currentUser = req.session.user;
    const tribe = new Tribe({
        tribeName: req.body.tribeName,
    });

    tribe.save().then(
        (tribe) => {
            User.findById(currentUser).then((user) => {
                Family.findById(user.familyID).then((family) => {
                    log(currentUser);
                    user.tribeAdmin.push(tribe._id);
                    family.tribes.push(tribe._id);
                    user.save()
                        .then((resU) => {
                            family
                                .save()
                                .then((result) => {
                                    res.send({
                                        user: resU,
                                        family: result,
                                        tribe,
                                    });
                                })
                                .catch((error) => {
                                    res.status(400).send(error);
                                });
                        })
                        .catch((error) => {
                            res.status(400).send(error);
                        });
                });
            });
        },
        (error) => {
            res.status(400).send(error);
        }
    );
});

app.delete("/tribe", (req, res) => {
    const tribeID = req.body.tribeID;

    Tribe.findByIdAndDelete(tribeID)
        .then(() => res.status(200).end())
        .catch((err) => res.status(400).end());
});

//edit a tribe - to be used only by admins
app.patch("/tribe", (req, res) => {
    const tribeID = req.body.tribeID;
    const changes = req.body.change;
    const currentUser = req.session.user;
    User.findById(currentUser).then((user) => {
        if (!user) {
            res.status(404).send("Resource Not Found");
        } else if (user.admin) {
            Tribe.findById(tribeID)
                .then((tribe) => {
                    tribe
                        .updateOne({ [changes[0]]: changes[1] })
                        .then(() => res.status(200).end())
                        .catch((err) => res.status(400).end());
                })
                .catch(() => res.status(400).end());
        } else {
            res.status(404).send({
                error: "Not authorized to perform this function",
            });
        }
    });
});

//Get tribe info
app.get("/tribe/:tid", (req, res) => {
    const tid = req.params.tid;

    if (!ObjectID.isValid(tid)) {
        res.status(404).send();
        return;
    }

    Tribe.findById(tid).then((tribe) => {
        if (!tribe) {
            res.status(404).send("Resource not found");
        } else {
            res.send(tribe);
        }
    });
});

//List Families in a tribe
app.get("/tribe/families/:tid", (req, res) => {
    const tid = req.params.tid;

    if (!ObjectID.isValid(tid)) {
        res.status(404).send();
        return;
    }

    Tribe.findById(tid).then((tribe) => {
        if (!tribe) {
            res.status(404).send("Resource not found");
        } else {
            Family.find({ tribes: tid }).then((family) => {
                if (!family) {
                    res.status(404).send("Resource not found");
                } else {
                    res.send({ family, tribeName: tribe.tribeName });
                }
            });
        }
    });
});

app.get("/tribe/lists/:tName", (req, res) => {
    const tName = req.params.tName;

    Tribe.findOne({ tribeName: tName }).then((tribe) => {
        let itemLists = [];

        const tid = tribe._id;
        Family.find({ tribes: tid }).then((family) => {
            res.send(family);
        });
    });
});

// Current users family joins tribe tid
app.patch("/tribe/join/:tid", (req, res) => {
    const tid = req.params.tid;

    if (!ObjectID.isValid(tid)) {
        res.status(404).send();
        return;
    }

    Tribe.findById(tid).then((tribe) => {
        if (!tribe) {
            res.status(404).send("Resource not found");
        } else {
            const currentUser = req.session.user;

            if (!currentUser) {
                res.status(404).send("Resource not found");
            } else {
                User.findById(currentUser).then((user) => {
                    const familyID = user.familyID;
                    if (!familyID) {
                        res.status(404).send("Resource not found");
                    } else {
                        Family.findById(familyID).then((family) => {
                            if (!family) {
                                res.status(404).send("Resource not found");
                            } else {
                                const tIdx = family.pending.indexOf(tid);
                                family.pending.splice(tIdx, 1);
                                family.tribes.push(tid);

                                family
                                    .save()
                                    .then((result) => {
                                        const fIdx = tribe.offers.indexOf(
                                            familyID
                                        );
                                        tribe.offers.splice(fIdx, 1);
                                        tribe.save().then((resolution) => {
                                            res.send({
                                                family,
                                                tribe: resolution,
                                            });
                                        });
                                    })
                                    .catch((error) => {
                                        res.status(400).send(error);
                                    });
                            }
                        });
                    }
                });
            }
        }
    });
});

// Current user declines invite to tribe tid
app.patch("/tribe/decline/:tid", (req, res) => {
    const tid = req.params.tid;

    if (!ObjectID.isValid(tid)) {
        res.status(404).send();
        return;
    }

    Tribe.findById(tid).then((tribe) => {
        if (!tribe) {
            res.status(404).send("Resource not found");
        } else {
            const currentUser = req.session.user;

            if (!currentUser) {
                res.status(404).send("Resource not found");
            } else {
                User.findById(currentUser).then((user) => {
                    const familyID = user.familyID;
                    if (!familyID) {
                        res.status(404).send("Resource not found");
                    } else {
                        Family.findById(familyID).then((family) => {
                            if (!family) {
                                res.status(404).send("Resource not found");
                            } else {
                                const tIdx = family.pending.indexOf(tid);
                                family.pending.splice(tIdx, 1);

                                family
                                    .save()
                                    .then((result) => {
                                        const fIdx = tribe.offers.indexOf(
                                            familyID
                                        );
                                        tribe.offers.splice(fIdx, 1);
                                        tribe.save().then((resolution) => {
                                            res.send({
                                                family,
                                                tribe: resolution,
                                            });
                                        });
                                    })
                                    .catch((error) => {
                                        res.status(400).send(error);
                                    });
                            }
                        });
                    }
                });
            }
        }
    });
});

// Invite a users family to join a tribe
app.patch("/tribe/invite/:uid", (req, res) => {
    const uid = req.params.uid;
    const tName = req.body.tribeName;

    if (!ObjectID.isValid(uid)) {
        res.status(404).send();
        return;
    }

    User.findById(uid).then((user) => {
        if (!user) {
            res.status(404).send("Resource not found");
        } else if (!user.familyID) {
            res.status(404).send("User does not belong to a family");
        } else {
            const currentFamily = user.familyID;

            Tribe.findOne({ tribeName: tName }).then((tribe) => {
                if (!tribe) {
                    res.status(404).send("Resource not found");
                } else {
                    Family.findById(currentFamily).then((family) => {
                        family.pending.push(tribe._id);
                        tribe.offers = currentFamily;
                        family.save();

                        tribe
                            .save()
                            .then((result) => {
                                res.send({ tribe: result, family });
                            })
                            .catch((error) => {
                                res.status(400).send(error);
                            });
                    });
                }
            });
        }
    });
});

// Create new list
app.post("/list", (req, res) => {
    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }
    const fid = req.body.fid;
    if (!ObjectID.isValid(fid)) {
        res.status(404).send();
        return;
    }

    Family.findById(fid).then((family) => {
        if (!family) {
            res.status(404).send("Resource not found");
        } else {
            const list = new List({
                listname: req.body.listname,
                familyID: req.body.fid,
                items: {},
                shared: req.body.shared,
            });

            list.save().then(
                (list) => {
                    res.send(list);
                },
                (error) => {
                    res.status(400).send(error);
                }
            );
        }
    });
});

// Returns all lists in an array belonging to family fid
app.get("/list/:fid", (req, res) => {
    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }
    const fid = req.params.fid;

    if (!ObjectID.isValid(fid)) {
        res.status(404).send();
        return;
    }

    List.find({ familyID: fid }).then((lists) => {
        res.send(lists);
    });
});
//delete list
app.delete("/list", (req, res) => {
    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }
    const listName = req.body.listname;
    const familyID = req.body.fid;

    if (!ObjectID.isValid(familyID)) {
        res.status(404).send();
        return;
    }

    List.find({ familyID })
        .then((lists) => {
            const list = lists.find((list) => {
                return list.listname === listName;
            });

            list.remove()
                .then(() => {
                    res.status(200).end();
                })
                .catch((err) => res.status(400));
        })
        .catch((err) => res.end());
});

// add item to a list
app.post("/item", (req, res) => {
    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }
    const listName = req.body.listname;
    const familyID = req.body.fid;

    if (!ObjectID.isValid(familyID)) {
        res.status(404).send();
        return;
    }

    List.find({ familyID }).then((lists) => {
        const list = lists.find((list) => {
            return list.listname === listName;
        });

        if (list.items !== undefined) {
            const updatedList = list.items;

            updatedList[req.body.itemname] = Number(req.body.quantity);
            list.updateOne({ items: updatedList })
                .then(() => {
                    list.save()
                        .then((result) => {
                            res.send({ list });
                        })
                        .catch((error) => {
                            res.status(400).send(error);
                        });
                })
                .catch((err) => {
                    res.status(400).send(error);
                });
        }
    });
});
app.patch("/item", (req, res) => {
    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }
    const listName = req.body.listname;
    const familyID = req.body.fid;
    const prevName = req.body.prevName;
    const newName = req.body.newName;
    const quantity = req.body.quantity;
    if (!ObjectID.isValid(familyID)) {
        res.status(404).send();
        return;
    }
    List.find({ familyID })
        .then((lists) => {
            const list = lists.find((list) => {
                return list.listname === listName;
            });

            const items = list.items;
            delete items[prevName];
            items[newName] = quantity;
            list.updateOne({ items })
                .then(() => res.status(200).end())
                .catch((err) => res.status(400).end());
        })
        .catch((err) => res.status(400).end());
});

//delete item from a list
app.delete("/item", (req, res) => {
    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }
    const listName = req.body.listname;
    const familyID = req.body.fid;
    const itemName = req.body.itemname;
    if (!ObjectID.isValid(familyID)) {
        res.status(404).send();
        return;
    }
    List.find({ familyID })
        .then((lists) => {
            const list = lists.find((list) => {
                return list.listname === listName;
            });

            const items = list.items;
            delete items[itemName];
            list.updateOne({ items })
                .then(() => res.status(200).end())
                .catch((err) => res.status(400).end());
        })
        .catch((err) => res.status(400).end());
});

//Map database
app.get("/MapList", (req, res) => {
    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }

    MapList.find()
        .then((groceries) => {
            res.send({ groceries });
        })
        .catch((error) => {
            log(error);
            res.status(500).send("Internal Server Error");
        });
});
app.post("/MapList", (req, res) => {
    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }
    const groceries = new MapList({
        name: req.body.name,
        address: req.body.address,
        open: req.body.open,
        wait: req.body.wait,
        coordinates: req.body.coordinates,
    });
    groceries
        .save()
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            if (isMongoError(error)) {
                // check for if mongo server suddenly dissconnected before this request.
                res.status(500).send("Internal server error");
            } else {
                log(error); // log server error to the console, not to the client.
                res.status(400).send("Bad Request"); // 400 for bad request gets sent to client.
            }
        });
});

// {
//     timesubmitted: <Time submitted>
//
// }
app.post("/MapList/:mid", (req, res) => {
    const id = req.params.mid;
    const timesubmitted = req.body.timesubmitted;
    if (!ObjectID.isValid(id)) {
        res.status(404).send();
        return;
    }

    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }
    const time = {
        date: new Date(),
        time: timesubmitted,
    };
    MapList.findById(id)
        .then((result) => {
            if (!result) {
                res.status(404).send("Resource not found");
            } else {
                result.timesubmitted.push(time);
                result
                    .save()
                    .then((result) => {
                        const timesum = result.timesubmitted.reduce(function (
                            sum,
                            b
                        ) {
                            return sum + b.time;
                        },
                        0);
                        const timeav = timesum / result.timesubmitted.length;
                        const fieldstoupdate = {
                            wait: parseInt(timeav) + "min",
                        };
                        MapList.findByIdAndUpdate(
                            id,
                            { $set: fieldstoupdate },
                            { new: true, useFindAndModify: false }
                        )
                            .then((groceries) => {
                                if (!groceries) {
                                    res.status(404).send();
                                } else {
                                    res.send(groceries);
                                }
                            })
                            .catch((error) => {
                                if (isMongoError(error)) {
                                    // check for if mongo server suddenly dissconnected before this request.
                                    res.status(500).send(
                                        "Internal server error"
                                    );
                                } else {
                                    log(error);
                                    res.status(400).send("Bad Request"); // bad request for changing the student.
                                }
                            });
                    })
                    .catch((error) => {
                        if (isMongoError(error)) {
                            // check for if mongo server suddenly dissconnected before this request.
                            res.status(500).send("Internal server error");
                        } else {
                            log(error);
                            res.status(400).send("Bad Request"); // bad request for changing the student.
                        }
                    });
            }
        })
        .catch((error) => {
            if (isMongoError(error)) {
                // check for if mongo server suddenly dissconnected before this request.
                res.status(500).send("Internal server error");
            } else {
                log(error);
                res.status(400).send("Bad Request"); // bad request for changing the student.
            }
        });
});
/*
[
  { "path": "/name", "value": "Owen" },
  {  "path": "/decription", "value": "Jim" },
  
  ...
]
*/
app.patch("/MapList/:mid", (req, res) => {
    const id = req.params.mid;
    if (!ObjectID.isValid(id)) {
        res.status(404).send();
        return; // so that we don't run the rest of the handler.
    }

    // check mongoose connection established.
    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }

    // Find the fields to update and their values.
    const fieldsToUpdate = {};
    req.body.map((change) => {
        const propertyToChange = change.path.substr(1);
        // log(propertyToChange)
        fieldsToUpdate[propertyToChange] = change.value;
    });
    MapList.findByIdAndUpdate(
        id,
        { $set: fieldsToUpdate },
        { new: true, useFindAndModify: false }
    ).then((result) => {
        if (!result) {
            res.status(404).send("Resource not found");
        } else {
            res.send(result);
        }
    });
});

app.get("/City", (req, res) => {
    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }

    City.find()
        .then((City) => {
            const obj = {};
            City.map((item) => (obj[item.name] = item.coordinate));
            res.send(obj);
        })
        .catch((error) => {
            log(error);
            res.status(500).send("Internal Server Error");
        });
});
/*
 {"name": "missi",
    coordinate: [1,2] }
*/
app.post("/City", (req, res) => {
    const coordinate = req.body.coordinate;
    const name = req.body.names;
    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }
    const city = new City({
        name: name,
        coordinate: coordinate,
    });
    city.save()
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            if (isMongoError(error)) {
                // check for if mongo server suddenly dissconnected before this request.
                res.status(500).send("Internal server error");
            } else {
                log(error); // log server error to the console, not to the client.
                res.status(400).send("Bad Request"); // 400 for bad request gets sent to client.
            }
        });
});

/* API Routes *** */
app.get("/all", (req, res) => {
    const currentUser = req.session.user;

    User.findById(currentUser).then((user) => {
        if (!user) {
            res.status(404).send("Resource Not Found");
        } else if (user.admin) {
            User.find()
                .then((allUsers) => res.status(200).send(allUsers))
                .catch((error) => {
                    console.log(error);
                    res.status(400).send({});
                });
        } else {
            res.status(404).send({
                error: "Not authorized to perform this function",
            });
        }
    });
});
app.get("/all/tribe", (req, res) => {
    const currentUser = req.session.user;

    User.findById(currentUser).then((user) => {
        if (!user) {
            res.status(404).send("Resource Not Found");
        } else if (user.admin) {
            Tribe.find()
                .then((allTribes) => res.status(200).send(allTribes))
                .catch((error) => {
                    res.status(400).send({});
                });
        } else {
            res.status(404).send({
                error: "Not authorized to perform this function",
            });
        }
    });
});
app.get("/all/family", (req, res) => {
    const currentUser = req.session.user;

    User.findById(currentUser).then((user) => {
        if (!user) {
            res.status(404).send("Resource Not Found");
        } else if (user.admin) {
            Family.find()
                .then((allFamilies) => res.status(200).send(allFamilies))
                .catch((error) => {
                    console.log(error);
                    res.status(400).send({});
                });
        } else {
            res.status(404).send({
                error: "Not authorized to perform this function",
            });
        }
    });
});
// Get all families - to be used by admin (verification performed)
app.post("/admin/family", (req, res) => {
    const currentUser = req.session.user;

    User.findById(currentUser).then((user) => {
        if (!user) {
            res.status(404).send("Resource Not Found");
        } else if (user.admin) {
            const family = new Family({
                familyName: req.body.familyName,
            });

            Family.create(family)
                .then(() => {
                    res.status(200).send();
                })
                .catch((error) => res.status(400).send(error));
        } else {
            res.status(404).send({
                error: "Not authorized to perform this function",
            });
        }
    });
});

app.post("/admin/tribe", (req, res) => {
    const currentUser = req.session.user;

    User.findById(currentUser).then((user) => {
        if (!user) {
            res.status(404).send("Resource Not Found");
        } else if (user.admin) {
            const tribe = new Tribe({
                tribeName: req.body.tribeName,
            });

            Tribe.create(tribe)
                .then(() => {
                    res.status(200).send();
                })
                .catch((error) => res.status(400).end());
        } else {
            res.status(404).send({
                error: "Not authorized to perform this function",
            });
        }
    });
});
/* Webpage routes *** */

app.use(express.static(__dirname + "/client/build"));

app.get("*", (req, res) => {
    // check mongoose connection established.
    if (mongoose.connection.readyState != 1) {
        log("Issue with mongoose connection");
        res.status(500).send("Internal server error");
        return;
    }

    const goodPageRoutes = [
        "/",
        "/map",
        "/tribe",
        "grocerylists",
        "admin",
        "profile",
    ];
    if (!goodPageRoutes.includes(req.url)) {
        res.status(404);
    }

    res.sendFile(__dirname + "/client/build/index.html");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    log(`Listening on port ${port}...`);
});

/* Helper Functions Below *** */

function isMongoError(error) {
    return (
        typeof error === "object" &&
        error !== null &&
        error.name === "MongoNetworkError"
    );
}
