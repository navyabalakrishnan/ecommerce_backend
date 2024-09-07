import jwt from "jsonwebtoken"
import serverConfig from "../config/serverConfig.js";

const authenticateSeller=(req,res,next)=>
{
    const token=req.cookies.token;
    if (!token) {
        return res.status(401).send({ message: "Unauthorized: No token provided" });
      }
   
   
    jwt.verify(token,serverConfig.token,(err,result)=>{
        if (err) {
            console.log(err)
            return res.status(401).send("not verified")
        } 
        console.log("role",result.role)
        // if(result.role !== "seller" && result.role !== "admin" )
        if(result.role !== "seller" )
        {
            return res.status(401).send("not seller")
        }
            req.user=result;
            next();

    })
}
export default authenticateSeller
