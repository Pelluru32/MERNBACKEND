const express = require('express')
const router = express.Router()
const { getAllUsers, createNewUser, updateUser, deleteUser } = require("../controller/usersController")
const verifyJwt = require('../middleware/verifyJwt')

router.use(verifyJwt)

router.route("/")
    .get(getAllUsers)
    .post(createNewUser)
    .put(updateUser)
    .delete(deleteUser)


module.exports=router