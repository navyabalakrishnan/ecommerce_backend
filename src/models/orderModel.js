import mongoose from 'mongoose';




const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  full_name: { type: String, required: true },
  email: { type: String, required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'verified', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true }
  },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' } ,
  paymentStatus: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' },
  paymentMethod: { type: String, enum: ['onlinePayment', 'cashOnDelivery'] }
}, { timestamps: true });





const Order = mongoose.model('Order', orderSchema);
export default Order;