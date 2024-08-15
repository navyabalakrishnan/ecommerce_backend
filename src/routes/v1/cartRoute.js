
import express from "express";

import { getCart,createCart,updateCart,deleteCartitem} from "../../controllers/cartController.js";


const cartRouter = express.Router();
cartRouter.get("/",  getCart);
cartRouter.post("/addtocart", createCart);

cartRouter.put("/update", updateCart);
cartRouter.delete("/:productId", deleteCartitem);

export default cartRouter;