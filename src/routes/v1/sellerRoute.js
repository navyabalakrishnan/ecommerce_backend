import express from "express";
import { signup, signin, getSellers,getSellersEmail, deleteSeller,checkAdmin, checkSeller} from "../../controllers/sellerController.js";
import authenticateSeller from "../../middleware/sellerMiddleware.js";
import authenticateAdmin from "../../middleware/adminMiddleware.js";
const sellerRouter = express.Router();

sellerRouter.post("/signup", signup);
sellerRouter.post("/signin", signin);
sellerRouter.get("/get-sellers", getSellers);
sellerRouter.get("/get-selleremail", getSellersEmail);
sellerRouter.delete("/:id", deleteSeller);
sellerRouter.get("/check-admin",authenticateAdmin,checkAdmin);

sellerRouter.get("/check-seller",authenticateSeller,checkSeller);
sellerRouter.post("/logout", (req, res) => {
    // res.clearCookie('token');
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
       
      });
    res.status(200).send({ message: 'Logged out successfully' });
});
export default sellerRouter;