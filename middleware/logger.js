const {format} =require("date-fns")
const {v4:uuid}=require("uuid")
const fs=require("fs")
const path=require("path")

fs.wri
const logEvents=async(message,logFileName)=>{
    const dateTime=format(new Date(),`yyyyMMdd\tHH:mm:ss`)
    const logItem=`${dateTime}\t${uuid()}\t${message}\n`
    try {
       if(fs.accessSync(path.join(__dirname,"..","logs"))){
        await fs.mkdir(path.join(__dirname,"..","logs"))
       } 
       await fs.appendFile(path.join(__dirname,"..","logs",logFileName),logItem,(err)=>{if(err)console.log(err)})
    } catch (error) {
        console.log(error);
    }
}

const logger=(req,res,next)=>{
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`,`reqLog.log`)
    console.log(`${req.method}\t${req.url}`);
    next()
}

module.exports={logEvents,logger}