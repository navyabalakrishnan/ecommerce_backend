import jwt from "jsonwebtoken"
import serverConfig from "../config/serverConfig.js";

const authenticateSeller=(req,res,next)=>
{
    const token=req.cookies.token;
    console.log('Token:', token); 
   
    jwt.verify(token,serverConfig.token,(err,result)=>{
        if (err) {
            console.log(err)
            return res.status(401).send("not verified")
        } 
        console.log("seller token",result)
        if(result.role !== "seller" && result.role !== "admin" )
        {
            return res.status(401).send("not seller and admin")
        }
            req.user=result;
            next();

    })
}
export default authenticateSeller
