import jwt from "jsonwebtoken";
import serverConfig from "../config/serverConfig.js";

function adminToken(user) {
    return jwt.sign({data:user.email,role:user.role}, serverConfig.token, { expiresIn: '2d' });
}

export default adminToken;