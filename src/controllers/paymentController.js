import express from "express";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/paymentModel.js";
import razorpayInstance from "../config/razorPayInstance.js";

import Order from "../models/orderModel.js";
dotenv.config();

const paymentRouter = express.Router();


paymentRouter.post("/order", (req, res) => {
  const { amount,orderId } = req.body;

  try {
    const options = {
      amount: Number(amount * 100),
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Something Went Wrong!" });
      }
      res.status(200).json({ data: order });
      console.log(order);
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
});

paymentRouter.post("/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto.createHmac('sha256', process.env.KEY_SECRET).update(body).digest('hex');

  if (expectedSignature === razorpay_signature) {
    try {
      const newPayment = new Payment({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderId,
        paymentStatus: 'paid', 
        paymentMethod: 'onlinePayment' 
        
      });
      await newPayment.save();
      const updatedOrder = await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid',
        paymentMethod: 'onlinePayment'
      }, { new: true });

      if (!updatedOrder) {
        console.log(`Order with ID ${orderId} not found.`);
        return res.status(404).json({ message: "Order Not Found" });
      }

      console.log('Payment Verified and Saved:', { orderId, razorpay_order_id, razorpay_payment_id }); 
      res.json({ message: "Payment Successfully" });
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ message: "Payment Verification Failed" });
  }
});
export default paymentRouter;