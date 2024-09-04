import jwt from "jsonwebtoken"
import serverConfig from "../config/serverConfig.js";
const authenticateAdmin=(req,res,next)=>
{
    const token=req.cookies.token;
    console.log('token:',token);
    jwt.verify(token,serverConfig.token,(err,result)=>{
        if (err) {
            console.log(err)
            return res.status(401).send("not verified")
        } 
        console.log("adminToken RESULT",result)
        if(result.role !== "admin")
        {
            return res.status(401).send("not admin")
        }
            req.user=result;
            next();

        
    })
}
export default authenticateAdmin