import express from "express";
import { signup, signin, getSellers, deleteSeller, checkAdmin} from "../../controllers/sellerController.js";
import authenticateSeller from "../../middleware/sellerMiddleware.js";
const sellerRouter = express.Router();

sellerRouter.post("/signup", signup);
sellerRouter.post("/signin", signin);
sellerRouter.get("/get-sellers", getSellers);
sellerRouter.delete("/:id", deleteSeller);
sellerRouter.get("/check-seller",authenticateSeller,checkAdmin);
export default sellerRouter;