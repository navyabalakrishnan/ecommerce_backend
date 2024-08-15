import express from "express";
import { signup, signin,checkUser } from "../../controllers/userController.js";
import authenticateUser from "../../middleware/userMiddleware.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.get("/check-user",authenticateUser,checkUser)
userRouter.post("/logout", (req, res) => {
    res.clearCookie('token'); 
    res.status(200).send({ message: 'Logged out successfully' });
});

export default userRouter;