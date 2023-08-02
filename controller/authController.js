const jwt = require("jsonwebtoken")
const User = require("../models/User")
const bcrypt=require("bcrypt")
const loginLimiter = require("../middleware/loginLimiter")



const login = async(req,res)=>{
 const {username,password}=req.body
 if(!username||!password){
   return res.status(400).json({message:"Both fields are required"})
 }
 try {
    const foundUser=await User.findOne({username:username})
    if(!foundUser.active){
      return  res.status(401).json({message:"Unauthorized"})
    }
    const match=await bcrypt.compare(password,foundUser.password)
    
    if(!match){return res.status(401).json({message:"Unauthorized"})}

    const accessToken=await jwt.sign({
        "userInfo":{"username":foundUser.username,"roles":foundUser.roles},
    },process.env.ACCESS_TOKEN,{expiresIn:"10m"})
    
    const refreshToken=await jwt.sign({"username":foundUser.username},
    process.env.REFRESH_TOKEN,{expiresIn:"1d"})
    
   await res.cookie("jwt",refreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:"None",
        maxAge:24*60*60*1000
    })
    await res.json({accessToken})
    
 } catch (error) {
    res.status(401).json({message:"Unauthorized"})
 }
}


const refresh = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const refreshToken = cookies.jwt;
  
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden' });
      }
  
      const foundUser = await User.findOne({ username: decoded.username });
  
      if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      const accessToken = jwt.sign(
        {
          userInfo: { username: foundUser.username, roles: foundUser.roles },
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: '15m' }
      );
  
      return res.json({ accessToken });
    });
  };



  const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}


module.exports={login,logout,refresh}