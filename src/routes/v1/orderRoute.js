
import express from "express";

import {createOrder,cancelOrder} from "../../controllers/orderController.js";


const orderRouter = express.Router();
orderRouter.post("/",  createOrder);

orderRouter.delete("/:orderId", cancelOrder);

export default orderRouter;