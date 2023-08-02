const mongoose=require("mongoose")

const Schema=mongoose.Schema

const userSchema=new Schema({
    username:{required:true,type:String,unique:true},
    password:{required:true,type:String},
    active:{type:Boolean,default:true},
    roles:[{
        type: String,
        default: "Employee"
    }],
})


module.exports=mongoose.model("User",userSchema)