const User = require("../models/User");
const Note = require("../models/Note");
const bcrypt = require("bcrypt");

const getAllUsers = (req, res) => {
    User.find()
        .then((dbres) => {
            if (dbres.length) {
                return res.status(200).json(dbres);
            } else {
                return res.status(400).json({ message: "No users found" });
            }
        })
        .catch((err) => {
            res.status(400).json({ message: "No users found" });
        });
};

const createNewUser = (req, res) => {
    const { username, password, roles } = req.body;

    if (!username || !password || !roles.length || !Array.isArray(roles)) {
        res.status(400).json({ message: "All fields are required*" });
    } else {
        const hashpwd = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        const user = new User({ username, password: hashpwd, roles });

        user.save()
            .then((dbres) => {
                res.status(201).json({ message: `${dbres.username} is added to db` });
            })
            .catch((err) => {
                console.log(err);
                if (err.code === 11000) {
                    res.status(409).json({ message: `duplicate username` });
                } else {
                    res.status(400).json({ message: ` new user can't be created` });
                }
            });
    }
};

const updateUser = (req, res) => {
    const { id, username, active, password, roles } = req.body;
    if (!username || !roles.length || !Array.isArray(roles) || !id || typeof active !== "boolean") {
        res.status(400).json({ message: "All fields are required except password*" });
    }
    else {
        let hashpwd
        User.findById({ _id: id })
            .then((dbres) => {
                if (password) {
                    hashpwd = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
                    dbres.passowrd = hashpwd
                }
                (dbres.username = username),
                    (dbres.roles = roles),
                    (dbres.active = active),
                    dbres.save()
                        .then((updbres) => {
                            res
                                .status(201)
                                .json({ message: `${updbres.username} is updated to db` });
                        })
                        .catch((err) => {
                            if (err.code === 11000) {
                                res.status(409).json({ message: `duplicate username` });
                            } else {
                                res.status(400).json({ message: `can't update user` });
                            }

                        });
            })
            .catch((err) => {
                res.status(400).json({ message: `Invalid details you sent` });
            });
    }
};

const deleteUser = (req, res) => {
    const { id } = req.body;
    if (!id) {
        res.status(400).json({ message: "Id field is required*" });
    } else {
        Note.findById({ user: id })
            .then((dbres) => {
                res.status(400).json({ message: "user assigned to notes" });
            })
            .catch((err) => {
                User.findByIdAndDelete({ _id: id })
                    .then((dbres) => {
                        res.status(201).json({ message: "user deleted" });
                    })
                    .catch((err) => {
                        res.status(400).json({ message: "user not found" });
                    });
            });
    }
};

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };
