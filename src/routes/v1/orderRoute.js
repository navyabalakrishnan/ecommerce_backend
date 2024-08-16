
import express from "express";

import {createOrder,cancelOrder, getOrder} from "../../controllers/orderController.js";
import authenticateSeller from "../../middleware/sellerMiddleware.js";


const orderRouter = express.Router();
orderRouter.post("/",  createOrder);
orderRouter.delete("/:orderId", cancelOrder);
orderRouter.get("/getorders",getOrder)

export default orderRouter;