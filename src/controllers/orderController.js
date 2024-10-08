import Order from '../models/orderModel.js';
import Cart from '../models/cartModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import jwt from "jsonwebtoken"
import mongoose from 'mongoose';
import serverConfig from '../config/serverConfig.js';
import Seller from '../models/sellerModel.js';

export const createOrder = async (req, res) => {
  try {
    const { full_name, email, shippingAddress } = req.body;

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    console.log(token)
    const decoded = jwt.verify(token, serverConfig.token);
    console.log("decoded", decoded)
    const user = new mongoose.Types.ObjectId(decoded.username);
    const userId = await User.findById(user);
    const cart = await Cart.findOne({ userId }).populate('items.product');
    console.log("cart ", cart)

    if (!cart || cart.items.length === 0) {
      return res.status(404).send({ message: "Cart is empty or not found" });
    }
    
    let totalAmount = 0;
    const orderProducts = cart.items.map(item => {
      totalAmount += item.quantity * item.product.price;
      return {
        product: item.product._id,
        quantity: item.quantity,
        seller: item.product.seller,
      };
    });
   
    const newOrder = new Order({
      userId,
      full_name,
      email,
      products: orderProducts,
      totalAmount,
      shippingAddress,
    
    });
    const savedOrder = await newOrder.save();
    await Cart.updateOne({ userId }, { $set: { items: [], total: 0 } });
    return res.status(201).send({ message: "Order created successfully",  orderId: savedOrder._id});
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).send({ message: "Failed to create order", error: error.message });
  }
};


export const getOrder = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    const decoded = jwt.verify(token,serverConfig.token);
    const seller = await Seller.findOne({ email: decoded.data });
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    const sellerId = seller._id;
    const orders = await Order.find({
      'products.seller': sellerId
    }).populate('products.product');
    const filteredOrders = orders.map(order => {
      const filteredProducts = order.products.filter(product =>
        product.seller.toString() === sellerId.toString()
      );
      return {
        ...order.toObject(),
        products: filteredProducts
      };
    });
    res.json(filteredOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Failed to fetch data");
  }
};
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('products.product');
    if (!orders.length) {
      return res.status(404).json({ message: "No orders found" });
    }
    res.json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).send("Failed to fetch data");
  }
};



export const getOrderByuserId = async (req, res) => {
try {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  console.log(token)
  const decoded = jwt.verify(token, serverConfig.token);
  console.log("decoded", decoded)
  const user = new mongoose.Types.ObjectId(decoded.username);
  const userId = await User.findById(user);
  const orders = await Order.find({ userId }).populate('products.product');
  
  if (!orders.length) {
    return res.status(404).json({ message: 'No orders found for this user' });
  }
  
  res.json(orders);
} catch (error) {
  res.status(500).json({ message: 'Server error', error });
}
}



export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const cancelOrder = await Order.findByIdAndDelete(orderId)
    console.log("Order is Cancelled ")
    return res.send({ message: "order is cancelled", cancelOrder })
  }
  catch (error) {
    console.log("Error:", error)
  }}