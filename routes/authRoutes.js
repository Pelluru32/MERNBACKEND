const express=require("express")
const authController=require("../controller/authController")
const loginLimiter = require("../middleware/loginLimiter")
const Router= express.Router()

Router.route("/")
.post(loginLimiter,authController.login)


Router.route("/refresh")
.get(authController.refresh)


Router.route("/logout")
.post(authController.logout)



module.exports=Router