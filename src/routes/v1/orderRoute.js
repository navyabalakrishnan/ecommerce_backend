
import express from "express";

import {createOrder,cancelOrder, getOrder} from "../../controllers/orderController.js";
import authenticateAdmin from "../../middleware/adminMiddleware.js";


const orderRouter = express.Router();
orderRouter.post("/",  createOrder);
orderRouter.delete("/:orderId", cancelOrder);
orderRouter.get("/getorders",authenticateAdmin,getOrder)

export default orderRouter;