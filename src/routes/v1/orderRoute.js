
import express from "express";

import {createOrder,cancelOrder, getOrder,getAllOrders} from "../../controllers/orderController.js";
import authenticateSeller from "../../middleware/sellerMiddleware.js";


const orderRouter = express.Router();
orderRouter.post("/",  createOrder);
orderRouter.delete("/:orderId", cancelOrder);
orderRouter.get("/getorders",getOrder)
orderRouter.get("/getAllOrders",getAllOrders)

export default orderRouter;