const rateLimit = require('express-rate-limit')
const {logEvents}= require("./logger")


const loginLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 5, // Limit each IP to 5 create account requests per `window` (here, per hour)
	message:
		{message:'Too many accounts created from this IP, please try again after an one minute'},
	handler: (req,res,next,options)=>{
        logEvents(`Too Many Requests:${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,"errLog.Log")
        res.status(options.statusCode).send(options.options)
    },
     standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})



module.exports=loginLimiter