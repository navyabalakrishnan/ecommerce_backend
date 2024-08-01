
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

export const createCart = async (req, res) => {

  const { product, quantity, userId } = req.body;

  try {

 
    if (!userId) {
      return res.status(400).send({ message: "User ID is required" });
    }

    const item = await Product.findById(product);

    if (!item) {
      return res.status(404).send({ message: "Product not found" });
    }

    const price = item.price;

   
    let cart = await Cart.findOne({ userId });

    if (cart) {
      const itemIndex = cart.items.findIndex((cartItem) => cartItem.product.toString() === product);

      if (itemIndex > -1) {
        let cartItem = cart.items[itemIndex];
        cartItem.quantity += quantity;
        cart.items[itemIndex] = cartItem;
      } else {
        cart.items.push({ product, quantity });
      }

      cart.total = cart.items.reduce((acc, curr) => acc + curr.quantity * price, 0);
      await cart.save();
      return res.status(200).send(cart);
    } else {

      const newCart = await Cart.create({
        userId,
        items: [{ product, quantity }],
        total: quantity * price,
      });
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
    const { userId } = req.params; 

    if (!userId) {
      return res.status(400).send({ message: "User ID is required" });
    }

    const cart = await Cart.findOne({ userId }).populate('items.product');

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