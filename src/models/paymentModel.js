import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  paymentStatus: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' },
  paymentMethod: { type: String, enum: ['credit_card', 'paypal', 'onlinePayment'], required: true }
});

export default mongoose.model("Payment", paymentSchema);

