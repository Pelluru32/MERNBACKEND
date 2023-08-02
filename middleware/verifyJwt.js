const jwt = require("jsonwebtoken")

const verifyJwt = (req, res, next) => {
    const authHeader = req.headers.authorization||req.headers.Authorization
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "unauthorized" })
    } else {
        const accessToken = authHeader.split(" ")[1]
        jwt.verify(accessToken, process.env.ACCESS_TOKEN,
            (err, decoded) => {
                if (err) return res.status(403).json({ message: "Forbidden" })
                req.username = decoded.userInfo.username
                req.roles = decoded.userInfo.roles
                next()
            })
    }

}

module.exports=verifyJwt