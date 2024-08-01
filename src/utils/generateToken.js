import jwt from "jsonwebtoken";
import serverConfig from "../config/serverConfig.js";

function generateToken(username) {
    const payload = { username }; 
    return jwt.sign(payload, serverConfig.token, { expiresIn: '2d' });
}

export default generateToken;
