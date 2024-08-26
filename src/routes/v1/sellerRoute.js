import express from "express";
import { signup, signin, getSellers,getSellersEmail, deleteSeller, checkAdmin} from "../../controllers/sellerController.js";
import authenticateSeller from "../../middleware/sellerMiddleware.js";
const sellerRouter = express.Router();

sellerRouter.post("/signup", signup);
sellerRouter.post("/signin", signin);
sellerRouter.get("/get-sellers", getSellers);
sellerRouter.get("/get-selleremail", getSellersEmail);
sellerRouter.delete("/:id", deleteSeller);
sellerRouter.get("/check-seller",authenticateSeller,checkAdmin);
sellerRouter.post("/logout", (req, res) => {
    res.clearCookie('token'); 
    res.status(200).send({ message: 'Logged out successfully' });
});
export default sellerRouter;