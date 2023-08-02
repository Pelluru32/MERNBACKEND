const mongoose=require("mongoose")


const connectDb=async()=>{
    try {
       await mongoose.connect(process.env.DATABASE_URI)
    } catch (error) {
        console.log(err);
    }
}

module.exports=connectDb