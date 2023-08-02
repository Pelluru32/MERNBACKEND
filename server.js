require("dotenv").config()
const express=require("express")
const path=require("path")
const PORT=process.env.PORT||3500
const app =express()
const {logger,logEvents}=require("./middleware/logger")
const {errorHandler}=require("./middleware/errorHandler")
const cookieParser=require("cookie-parser")
var cors = require('cors')
const corsOptions = require("./config/corsOptions")
const connectDb=require("./config/dbConn")
const mongoose=require("mongoose")
const verifyJwt = require("./middleware/verifyJwt")


connectDb()
app.use(logger)

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.static(path.join(__dirname,"public")))


//routes/
app.use('/auth', require('./routes/authRoutes'))

//app.use(verifyJwt)
app.use('/users', require('./routes/userRoutes'))
app.use('/notes', require('./routes/noteRoutes'))


app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"views","index.html"))
})

app.all("*",(req,res)=>{
    res.status(404)
    if(req.accepts("html")){
        res.sendFile(path.join(__dirname,"views","404.html"))
    }else if(req.accepts("json")){
        res.json({message:"404 not found"})
    }else{
        res.type("txt").send("404 not found")
    }
})


app.use(errorHandler)



mongoose.connection.once("open",()=>{
    console.log("Db conneted");
    app.listen(PORT,"localhost",(err)=>{
        if(err)console.log(err);
        else console.log(`server is running on localhost with ${PORT}`);
    })
})

mongoose.connection.on("error",(err)=>{
    console.log(err);
    logEvents(`${err.no}:${err.code}\t${err.syscall}\t${err.hostname}`,"mongoErr.log")
})

