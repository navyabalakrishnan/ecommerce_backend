
import express from "express";

import { getCart,createCart,updateCart,deleteCartitem} from "../../controllers/cartController.js";


const cartRouter = express.Router();
cartRouter.get("/:userId",  getCart);
cartRouter.post("/addtocart",  createCart);
cartRouter.put("/:id", updateCart);
cartRouter.delete("/:cartId/:productId", deleteCartitem);

export default cartRouter;