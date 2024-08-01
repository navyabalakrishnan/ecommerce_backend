import Order from '../models/orderModel.js';
import Cart from '../models/cartModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

export const createOrder = async (req, res) => {
  try {
    const { userId, shippingAddress, paymentMethod, paymentStatus } = req.body;

    if (!userId || !shippingAddress || !paymentMethod) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    if (!['onlinePayment', 'cash_on_delivery'].includes(paymentMethod)) {
      return res.status(400).send({ message: "Invalid payment method" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const cart = await Cart.findOne({ userId }).populate('items.product');
    if (!cart) {
      return res.status(404).send({ message: "Cart not found" });
    }

    if (cart.items.length === 0) {
      return res.status(400).send({ message: "Cart is empty" });
    }

    let totalAmount = 0;
    const orderProducts = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id).populate('seller');
      if (product && product.seller) {
        totalAmount += item.quantity * product.price;
        orderProducts.push({
          product: item.product._id,
          quantity: item.quantity,
          seller: product.seller._id
        });
      } else {
        return res.status(400).send({ message: "Product or seller not found" });
      }
    }

    const newOrder = new Order({
      userId,
      products: orderProducts,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus
    });

    const savedOrder = await newOrder.save();

    await Cart.updateOne({ userId }, { $set: { items: [], total: 0 } });

    return res.status(201).send({ message: "Order created successfully", order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).send({ message: "Failed to create order", error: error.message });
  }
};

export const cancelOrder=  async(req,res)=>
{
    try{
        const{orderId}=req.params;
        const cancelOrder=await Order.findByIdAndDelete(orderId)
        console.log("Order is Cancelled ") 
        return res.send({message:"order is cancelled",cancelOrder })
    }
    catch(error){
        console.log("Error:",error)
    }  
    }

 