import dotenv from "dotenv";
import Razorpay from "razorpay";

dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.KEY_ID || "",
  key_secret: process.env.KEY_SECRET || "",
});

export default razorpayInstance;