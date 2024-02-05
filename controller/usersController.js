const User = require("../models/User");
const Note = require("../models/Note");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");

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
            res.status(500).json({ message: "Error occurred while fetching users" })
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

const updateUser = async(req, res) => {
    const { username, password, roles, id, active } = req.body

    if (!username || !roles.length || typeof active !== "boolean" || !id) {
        return res.status(403).json({ "message": "All fields are required" })
    }
    try {
        let findMechanic = await User.findById({ _id: id })
        findMechanic.username = username
        findMechanic.roles = roles
        findMechanic.active = active
        if (password) {
            findMechanic.password = await bcrypt.hash(password, 10)
        }
        await findMechanic.save()

        res.status(200).json({ "message": ` Mechanic ${findMechanic.username} is updated` })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ "message": "Username already exists, Can't update" });
        }
        res.status(500).json({ "message": "An error occurred while updating Mechanic. Please try again later." })
    }
};

/* const deleteUser = (req, res) => {
    const { id } = req.body;
    if (!id) {
        res.status(400).json({ message: "Id field is required*" });
    } else {
        Note.findOne({ user: id })
            .then((dbres) => {
                console.log("success");
                console.log(dbres);
                res.status(400).json({ message: "user assigned to notes" });
            })
            .catch((err) => {
                console.log(err);
                User.findByIdAndDelete({ _id: id })
                    .then((dbres) => {
                        res.status(201).json({ message: "user deleted" });
                    })
                    .catch((err) => {
                        res.status(400).json({ message: "user not found" });
                    });
            });
    }
}; */
const deleteUser=async(req,res)=>{
    try {
        const {id}= req.body
        if(!id){
            return res.status(400).json({ message: "Id field is required*" });
        }
        const notes= await Note.findOne({user:id})
        if(notes){
            return res.status(400).json({ message: "user assigned to notes" });
        }
        
        const users= await User.findByIdAndDelete({_id:id})
        if(users){
         return   res.status(201).json({ message: "user deleted" });
        }
          
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };
