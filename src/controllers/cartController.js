import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js';
import mongoose from "mongoose";
import serverConfig from "../config/serverConfig.js";
export const createCart = async (req, res) => {
  const { product, quantity } = req.body;
  try {
   
    const token = req.cookies.token; 
    console.log("token ", token)
    if (!token) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

 
    const decoded = jwt.verify(token, 'serverConfig.token'); 
    console.log("decoded",decoded)
    const user = new mongoose.Types.ObjectId(decoded.username);
    const userId = await User.findById(user);

    console.log("decoded", decoded)
    console.log("user", user)

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    req.user = decoded;

    const item = await Product.findById(product);
    if (!item) {
      return res.status(404).send({ message: "Product not found" });
    }

    const price = item.price;

    let cart = await Cart.findOne({ userId });
    console.log("cart", cart)
    if (cart) {
      console.log("Hi Inside cart ",product)
      const itemIndex = cart.items.findIndex((cartItem) => cartItem.product.toString() === product);

      if (itemIndex > -1) {
        let cartItem = cart.items[itemIndex];
        cartItem.quantity += quantity;
        cart.items[itemIndex] = cartItem;
      } else {
        cart.items.push({ product, quantity });
      }

      console.log("cart.items ",cart.items)
      cart.total = cart.items.reduce((acc, curr) => acc + curr.quantity * price, 0);
      console.log("cart Total", cart.total)
      console.log("cart save",cart)
      await cart.save();
      return res.status(200).send(cart);
    } else {
      const newCart = await Cart.create({
        userId: userId,
        items: [{ product, quantity }],
        total: quantity * price,
      });
      console.log(res.status)
      return res.status(201).send(newCart);
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).send("Something went wrong");
  }
};



export const updateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).send({ message: "Missing required fields" });
    }


    const cart = await Cart.findById(id);
    if (!cart) {
      return res.status(404).send({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {

      if (quantity === 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
    } else {
      return res.status(400).send({ message: "Product not found in cart" });
    }


    const products = await Product.find({ '_id': { $in: cart.items.map(item => item.product) } });
    const productMap = new Map(products.map(product => [product._id.toString(), product.price]));


    cart.total = cart.items.reduce((acc, item) => acc + item.quantity * (productMap.get(item.product.toString()) || 0), 0);


    const updatedCart = await cart.save();

    return res.status(200).send(updatedCart);
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).send({
      message: "Something went wrong",
      error: error.message,
    });
  }
};


export const getCart = async (req, res) => {
  try {
    
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, 'serverConfig.token'); 

    const user = new mongoose.Types.ObjectId(decoded.username);
    const userId = await User.findById(user);

    console.log("decoded", decoded)
    console.log("user", user)

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const cart = await Cart.findOne({ userId }).populate('items.product');

    // return res.status(200).send({ message: "added to cart" });
    if (!cart) {
      return res.status(404).send({ message: "Cart not found" });
    }
    return res.status(200).send(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).send({ message: "Failed to retrieve cart", error: error.message });
  }
};


export const deleteCartitem = async (req, res) => {
  try {
    const { cartId, productId } = req.params;



    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).send({ message: "Cart not found" });
    }


    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).send({ message: "Product not found in cart" });
    }


    cart.items.splice(itemIndex, 1);

    const products = await Product.find({ '_id': { $in: cart.items.map(item => item.product) } });
    const productMap = new Map(products.map(product => [product._id.toString(), product.price]));

    cart.total = cart.items.reduce((acc, item) => acc + item.quantity * (productMap.get(item.product.toString()) || 0), 0);


    const updatedCart = await cart.save();

    return res.status(200).send(updatedCart);
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return res.status(500).send({
      message: "Failed to delete item from cart",
      error: error.message,
    });
  }
};