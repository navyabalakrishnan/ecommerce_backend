import jwt from "jsonwebtoken";

import serverConfig from "../config/serverConfig.js";
function authenticateUser(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send({ message: "Unauthorized: No token provided" });
  }
  jwt.verify(token,serverConfig.token, (err, user) => {
   

    if (err) 
      {
        console.log(err)
        return res.status(401).send("not verified")
    }

    req.user = user;
    console.log(req.user.role);

    next();
  });

}

export default authenticateUser;