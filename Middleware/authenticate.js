const jwt=require("jsonwebtoken")
const authenticate=async(req,res,next)=>{
    let token=req.headers.authorization;
    if(token){
        console.log(token)
        jwt.verify(token,"shh",(err,decoded)=>{
            if(decoded){
                req.body.user=decoded.userId
                next()
            }else{
                res.status(401).send("Please Login First")
            }
        })
    }else{
        res.status(402).send("Please Login first")
    }
}
module.exports={
    authenticate
}